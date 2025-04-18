import { AudioStreamData, AudioStreamDataEmitCb, SocketHandler } from "@socket";
import { ConfigModel } from "@models";
import { SongProperties } from "@socket";
import { MusicQueue } from "./MusicQueue";
import { SongRequest } from "./SongRequest";
import { ConfigManager } from "../ConfigManager";
import { RequestSongByUserCommonParams } from "./types";
import { DynamicalPlaylist } from "./DynamicalPlaylist";
import { SongDataManager } from "./SongDataManager";
import StreamAudioLogic from "./StreamAudioLogic";
import { publicEndpointPath } from "@configs";
import { musicLogger, convertSecondsToMS } from "@utils";
import path from "path";
import { getOneUser, ManageSongLikesAction, manageSongLikesById } from "@services";
import { HelixCustomRewardRedemption, HelixCustomRewardRedemptionTargetStatus } from "@twurple/api";

interface HandleIfSongRequestRewardIsRedeemedParams {
  title: string;
  username: string;
  input: string;
  updateStatus: (newStatus: HelixCustomRewardRedemptionTargetStatus) => Promise<HelixCustomRewardRedemption>;
}

const SONG_REQUEST_REWARD_NAME = "Song Request";

class MusicHeadHandler {
  public static instance: MusicHeadHandler;
  private configs: ConfigModel = ConfigManager.getInstance().getConfig();
  private musicQueue: MusicQueue = new MusicQueue();
  private isPlaying = false;
  private songRequest: SongRequest = new SongRequest();
  private dynamicalPlaylist: DynamicalPlaylist = new DynamicalPlaylist();

  private isPlayingTimeout: NodeJS.Timeout | undefined;
  private readonly secondsBetweenAudio = 2;
  private volume = 50;

  private readonly delayBetweenServer = 2;
  private songDataManager: SongDataManager = new SongDataManager();
  private currentDelay = 0;
  private streamAudioLogic: StreamAudioLogic = new StreamAudioLogic();
  private constructor() {
    ConfigManager.getInstance().registerObserver(this.handleConfigUpdate.bind(this));
    this.prepareInitialQue();
    this.initSocketEvents(SocketHandler.getInstance());
  }
  public static getInstance() {
    if (!MusicHeadHandler.instance) {
      MusicHeadHandler.instance = new MusicHeadHandler();
    }
    return MusicHeadHandler.instance;
  }

  private initSocketEvents(socketHandler: SocketHandler) {
    socketHandler.subscribe("getAudioData", (cb) => {
      const audioData = this.getAudioStreamData();
      const isPlaying = this.isMusicPlaying();
      const songsInQue = this.getSongsInQueData();
      if (!audioData) return;
      cb({ isPlaying, audioData, songsInQue });
    });

    socketHandler.subscribe("musicPause", () => {
      this.pausePlayer();
    });

    socketHandler.subscribe("musicStop", () => {
      musicLogger.info("Add soon");
      //TODO: add music stop
    });

    socketHandler.subscribe("musicPlay", () => {
      this.resumePlayer();
    });

    //TODO: events from backend database?
    socketHandler.subscribe("loadPlaylist", async (playlistId: string) => {
      await this.loadNewSongs("yt", playlistId, true);
    });

    socketHandler.subscribe("loadFolder", async (folderName: string) => {
      await this.loadNewSongs("local", folderName, true);
    });

    socketHandler.subscribe("addSongToPlayer", async (songName: string) => {
      await this.requestSongLogic({ username: `mod`, songName });
    });

    socketHandler.subscribe("musicNext", () => {
      this.nextSong();
    });

    socketHandler.subscribe("changeVolume", (volume) => {
      this.changeVolume(volume);
    });
  }

  private async handleConfigUpdate(newConfigs: ConfigModel) {
    this.configs = newConfigs;
  }

  private async prepareInitialQue(): Promise<void> {
    //clear music que if contain something
    if (this.musicQueue.getLength() > 0) this.musicQueue.clear();

    const neededSongs = this.configs.musicConfigs.maxAutoQueSize;

    const songsForQue = await this.dynamicalPlaylist.getSongs(neededSongs, true);
    songsForQue.forEach((song) => this.addSongToQue(song));
  }

  private async requestSongLogic(data: RequestSongByUserCommonParams) {
    const { username, songName } = data;
    const { error, songData } = await this.songRequest.requestSong(username, songName);
    if (error || !songData) return error || "Couldn't add a song. Sorry";
    const [, song] = songData;
    if (this.musicQueue.shouldPrepareQue(this.configs.musicConfigs.maxAutoQueSize)) {
      this.addSongToQue(songData[1], songData[0]);
      this.songRequest.removeFromRequestedQue(username, song.id);
      this.emitGetAudioInfo();
    }
    SocketHandler.getInstance().getIO().emit("requestSong", { username, songName: song.name });
    const messageToSend = `@${username}, added ${song.name} song to que`;
    return messageToSend;
  }

  public async requestSongByCommand(data: RequestSongByUserCommonParams) {
    return await this.songRequest.requestSongByUser(data, async (error) => {
      if (error) return error;
      return await this.requestSongLogic(data);
    });
  }

  public async loadNewSongs(type: "yt" | "local", idOrFolderName: string, shuffle = false): Promise<string> {
    type === "yt"
      ? await this.dynamicalPlaylist.loadYTPlaylist(idOrFolderName)
      : await this.dynamicalPlaylist.loadFromLocalFolder(idOrFolderName);
    if (shuffle) this.dynamicalPlaylist.shuffle();

    await this.prepareInitialQue();
    this.emitGetAudioInfo();

    return `Loaded correct ${this.dynamicalPlaylist.getPlaylistDetails().name}`;
  }

  private addSongToQue(song: SongProperties, username?: string): boolean {
    const { id, name, duration, downloadedData, type } = song;
    this.musicQueue.enqueue({
      currentTime: 0,
      downloadedData,
      id,
      name,
      duration,
      volume: this.volume,
      requester: username,
      type
    });

    return true;
  }

  private getAudioStreamData(): AudioStreamData | undefined {
    const currentSong = this.songDataManager.getCurrentSong(this.isPlaying ? true : false);
    if (currentSong) {
      return { ...currentSong };
    }
  }

  private emitGetAudioInfo(): void {
    const audioData = this.getAudioInfo();
    SocketHandler.getInstance().getIO().emit("audioStreamData", {
      audioData,
      isPlaying: this.isPlaying,
      songsInQue: this.getSongsInQueData()
    });
  }

  private getSongsInQueData(): [string, string][] {
    const songsInQue: [string, string][] = [];

    this.musicQueue.getItems().forEach((queueItem) => {
      songsInQue.push([queueItem.name, queueItem.requester || ""]);
    });
    return songsInQue;
  }

  private getAudioInfo(): AudioStreamDataEmitCb["audioData"] {
    const currentSong = this.songDataManager.getCurrentSong(this.isPlaying ? true : false) || {
      id: "",
      name: "",
      duration: 0,
      currentTime: 0,
      volume: this.volume,
      type: "local"
    };
    return currentSong;
  }

  public async resumePlayer() {
    if (this.isPlaying) return musicLogger.info("Is playing already");

    this.startPlay(0, false);
  }

  private emitAudioStreamData() {
    const currentSong = this.songDataManager.getCurrentSong();
    if (!currentSong) return musicLogger.error("Couldn't send emit audio stream data info ");

    SocketHandler.getInstance().getIO().emit("audioStreamData", {
      isPlaying: this.isPlaying,
      audioData: currentSong,
      songsInQue: this.getSongsInQueData()
    });
  }

  private async startPlay(delay = 0, newSong = false) {
    this.isPlaying = true;
    this.isPlayingTimeout = setTimeout(async () => {
      if (!this.songDataManager.getCurrentSong() || newSong) {
        await this.setCurrentSongFromQue();
      }
      const currentSong = this.songDataManager.getCurrentSong();
      if (currentSong) {
        this.songDataManager.updateCurrentSongStart();
        this.currentDelay = currentSong.duration;
        this.emitAudioStreamData();

        this.emitGetAudioInfo();

        if (currentSong.downloadedData && currentSong.type !== "yt") {
          await this.streamAudioLogic.startEmiting(
            path.join(publicEndpointPath, currentSong.downloadedData.publicPath)
          );
        } else {
          this.streamAudioLogic.stopEmiting(true);
        }

        const delayNextSong = this.currentDelay - currentSong.currentTime;
        this.startPlay(delayNextSong * 1000, true);
      }
    }, delay + this.secondsBetweenAudio * 1000);
  }

  public sayWhenUserRequestedSong(username: string) {
    const songName = this.getNextUserSongName(username);
    if (!this.songRequest.checkIfUserHasAnySongInRequest(username) && !songName) {
      return `@${username}, you did not add any song to que (: `;
    }

    const remainingTime = this.getRemainingTimeToRequestedSong(username);

    return songName
      ? `@${username}, your song (${songName}) will be in ~${remainingTime}`
      : "No next song, something went wrong KappA";
  }

  private getRemainingTimeToRequestedSong(username: string) {
    let totalDuration = 0;

    totalDuration += this.getRemainingTimeOfCurrentSong();

    totalDuration += this.musicQueue.getDurationTillFindUserSong(username);

    const songIsInQue = this.getNextUserSongName(username);
    if (!songIsInQue) {
      totalDuration += this.songRequest.getDurationTillFindRequesterSong(username);
    }

    const [minutes, seconds] = convertSecondsToMS(totalDuration);

    return `${minutes}:${seconds}`;
  }

  private getNextUserSongName(username: string) {
    const foundedInQueue = this.musicQueue.getSongByUsername(username);
    if (foundedInQueue) return foundedInQueue.name;
    const foundedRequest = this.songRequest.getRequestByUserName(username)[0];
    if (foundedRequest) return foundedRequest[1].name;

    return;
  }

  public pausePlayer() {
    const cleared = this.clearTimeout();
    if (!cleared || !this.isPlaying) return;

    const currentSong = this.songDataManager.getCurrentSong(true);
    if (currentSong) {
      this.isPlaying = false;

      SocketHandler.getInstance().getIO().emit("musicPause", this.isPlaying);
    }
  }

  public async nextSong() {
    this.clearTimeout();
    this.startPlay(0, true);
  }

  private clearTimeout() {
    if (!this.isPlayingTimeout) return false;
    clearTimeout(this.isPlayingTimeout);
    return true;
  }

  private clearAndStopPlayer() {
    this.clearTimeout();

    this.songDataManager.setCurrentSong(null);
    this.isPlaying = false;
    this.emitGetAudioInfo();
  }

  private async setCurrentSongFromQue() {
    const nextSongData = this.musicQueue.peek();

    if (!nextSongData) {
      this.clearAndStopPlayer();

      musicLogger.info("No next song data in setCurrentSongFromQue");
      return;
    }

    const newCurrentSongData: AudioStreamData = {
      ...nextSongData,
      volume: this.volume,
      downloadedData: nextSongData.downloadedData
    };
    this.songDataManager.setCurrentSong(newCurrentSongData);
    this.musicQueue.removeFromQueById(newCurrentSongData.id);

    while (this.musicQueue.shouldPrepareQue(this.configs.musicConfigs.maxAutoQueSize)) {
      const added = this.addSongFromSROrLoadedPlaylist();
      if (!added) break;
    }
  }

  private addSongFromSROrLoadedPlaylist() {
    if (this.songRequest.getNonNullLength() > 0) {
      musicLogger.debug("Adding from SR");
      const [username, songProperties] = this.songRequest.dequeue() || [];

      //NOTE: ! assertion -> it's checked whether
      const added = this.addSongToQue(songProperties!, username!);
      if (added) return true;
    }
    musicLogger.debug("Adding from PLAYLSIT");
    const nextSongData = this.dynamicalPlaylist.getNextSongData(true /** TODO: add loop to config */);
    return nextSongData ? this.addSongToQue(nextSongData) : false;
  }

  private getNameOfCurrentSong() {
    const audioProps = this.songDataManager.getCurrentSong();
    if (!audioProps) return "Couldn't find song :(";

    let songName = audioProps.name;

    if (audioProps.requester) songName += ` Requested by @${audioProps.requester}`;

    return songName;
  }

  public changeVolume(volume: number) {
    if (isNaN(volume)) return;
    let valueToSet = volume;
    if (volume > 100) valueToSet = 100;
    else if (volume < 0) valueToSet = 0;

    this.volume = valueToSet;
    this.songDataManager.updateCurrentSong({ volume });

    SocketHandler.getInstance().getIO().emit("changeVolume", valueToSet);
  }

  private getRemainingTimeOfCurrentSong() {
    const currentSong = this.songDataManager.getCurrentSong();
    if (!currentSong) return 0;
    const time = Math.floor(currentSong.duration - this.songDataManager.getCurrentTimeSong());

    return time;
  }
  public sayNextSong() {
    const nextSong = this.musicQueue.getNextSongData();
    if (!nextSong) {
      return "There is no next song";
    }
    const time = this.getRemainingTimeOfCurrentSong();
    const [minutes, seconds] = convertSecondsToMS(time);
    return `Next song: ${nextSong.name} in ~${minutes}:${seconds} min.
      ${nextSong.requester ? `Requested by ${nextSong.requester}` : ""}
      `;
  }

  public sayPreviousSong() {
    try {
      const previousSong = this.songDataManager.getPreviousSong();
      return `${previousSong ? `Previous song: ${previousSong.name}` : "No previous song"}`;
    } catch {
      return `Not enought songs to do that uga buga`;
    }
  }

  public isMusicPlaying() {
    return this.isPlaying;
  }

  public async manageSongLikesByUser(username: string, action: ManageSongLikesAction) {
    const currentSong = this.songDataManager.getCurrentSong();
    if (!currentSong) {
      musicLogger.error("No current song. Likes works only when current song is playing");
      return;
    }

    const foundUser = await getOneUser({ username: username }, {});

    if (!foundUser) return musicLogger.error(`No user found with username: ${username}`);

    await manageSongLikesById(
      currentSong.type === "yt" ? { youtubeId: currentSong.id } : { id: currentSong.id },
      action,
      foundUser.id
    );
  }
  public async handleIfSongRequestRewardIsRedeemed({
    title,
    input,
    username,
    updateStatus
  }: HandleIfSongRequestRewardIsRedeemedParams) {
    if (title !== SONG_REQUEST_REWARD_NAME) return;

    const added = await this.songRequest.requestSong(username, input);
    if (added.error || !added.songData) await updateStatus("CANCELED");
  }
}

export default MusicHeadHandler;
