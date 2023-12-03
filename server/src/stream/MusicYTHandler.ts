import { Server } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  AudioYTDataInfo,
  AudioYTData,
  AudioDataRequester
} from "@socket";
import { MusicConfigs, UserDocument } from "@models";
import moment from "moment";
import MusicHeadHandler from "./MusicHeadHandler";
import { shuffleArray, convertSecondsToMS, isValidUrl } from "@utils";
import { SongProperties } from "./types";
import YoutubeApiHandler from "./YoutubeAPIHandler";
import { botId } from "@configs";
import {
  getOneUser,
  getSongs,
  createSong,
  ManageSongLikesAction,
  manageSongLikesByYoutubeId,
  updateSongs
} from "@services";

interface PlaylistDetails {
  id: string;
  name: string;
  count: number;
}

class MusicYTHandler extends MusicHeadHandler {
  private readonly youtubeAPIHandler: YoutubeApiHandler;
  private maxSongDuration = 60 * 10; // 10min; TODO: add to configs
  private playlistDetails: PlaylistDetails = {
    id: "",
    name: "",
    count: 0
  };
  private botUserInDB?: UserDocument;
  constructor(
    socketIO: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
    sayInAuthorizedChannel: (message: string) => void,
    configs: MusicConfigs
  ) {
    super(socketIO, sayInAuthorizedChannel, configs, "audioYT");
    this.youtubeAPIHandler = new YoutubeApiHandler();

    this.init();
  }

  private async init() {
    this.botUserInDB = await getOneUser({ twitchId: botId }, {});

    // TODO: add this.config.initialLoadFromDB ?
    await this.loadYoutubeSongsFromDatabase();
  }

  private async loadYoutubeSongsFromDatabase() {
    const songsListDB = await getSongs({ enabled: { $ne: false } }, { limit: 100, sort: { lastUsed: 1 } });

    if (songsListDB && songsListDB.length > 0) {
      const songsListWithMappedName = songsListDB.map(({ title, youtubeId, duration }) => ({
        name: title,
        id: youtubeId,
        duration
      }));
      this.songsList = songsListWithMappedName;
      await this.prepareInitialQue();
      console.log(`Successfuly loaded initial songs (${songsListDB.length})`);
      //TODO: pass this to logger
    }
  }

  protected override async onStartPlayNewSong(): Promise<void> {
    if (!this.currentSong || !this.botUserInDB) return;
    await this.addSongToDatabase(this.currentSong, this.botUserInDB._id);
    const isSongRequested = !!this.currentSong.requester;
    await this.manageSongUsesByUserId(
      this.currentSong.id,
      this.currentSong.requester?.id || this.botUserInDB.id,
      isSongRequested
    );
  }

  protected async addSongToQue(song: SongProperties, requester?: AudioDataRequester): Promise<void> {
    try {
      const { id, name: name, duration } = song;
      this.musicQue.push([
        id,
        {
          id: id,
          name: name,
          duration: duration,
          currentTime: 0,
          requester: requester,
          volume: this.volume
        }
      ]);
    } catch (err) {
      console.error("Error occured while trying adding song to que", err);
    }
  }

  protected async prepareInitialQue(): Promise<void> {
    if (this.songsList.length <= 0) {
      this.clientSay(`There are 0 songs for add to que`);
    }
    if (this.musicQue.length > 0) this.musicQue.splice(0, this.musicQue.length);
    //clear music que if contain something

    for (let i = 0; i <= this.configs.maxAutoQueSize; i++) {
      await this.addNextItemToQueAndPushToEnd();
    }

    this.addSongRequestListIntoQue();
  }

  //TODO: add possibility to take more than 50 items of playlist
  private async addVideosFromCurrentPlaylistIntoSongsList() {
    const videosIds = await this.youtubeAPIHandler.getYoutubePlaylistVideosIds(
      this.playlistDetails.id,
      this.playlistDetails.count
    );
    if (videosIds.length <= 0) return;

    const videosDetails = await this.getYoutubeVideosDetailsById(videosIds);

    if (videosDetails) {
      this.clientSay(`Loaded ${videosDetails.length} songs from ${this.playlistDetails.name} playlist into que.`);
      this.songsList = videosDetails;
    }
  }
  public async loadNewSongs(idOrFolderName: string, shuffle = false): Promise<void> {
    const playlistId = this.checkValidationOfUrlPlaylist(idOrFolderName);
    if (!playlistId) return;

    await this.setCurrentPlaylistNameById(playlistId);

    await this.addVideosFromCurrentPlaylistIntoSongsList();
    if (shuffle) this.songsList = shuffleArray(this.songsList);

    await this.prepareInitialQue();
    this.emitGetAudioInfo();
  }

  protected emitGetAudioInfo(): void {
    const audioInfo = this.getAudioInfo();
    if (audioInfo) {
      this.socketIO.emit("getAudioYTInfo", audioInfo);
    }
  }

  private checkValidationOfUrlPlaylist(playlist: string) {
    let id = playlist;
    if (isValidUrl(playlist)) {
      const playlistId = new URL(playlist).searchParams.get("list");
      if (playlistId) id = playlistId;
      else {
        return this.clientSay("Link is not a correct playlist");
      }
    }
    return id;
  }

  public getAudioInfo(): AudioYTDataInfo | undefined {
    const songsInQue: AudioYTDataInfo["songsInQue"] = [];

    this.musicQue.forEach(([, audioProps]) => {
      songsInQue.push([audioProps.name, audioProps.requester]);
    });
    const info: AudioYTDataInfo = {
      name: this.currentSong?.name || "",
      duration: this.currentSong?.duration || 0,
      currentTime: this.getCurrentTimeSong(),
      songsInQue: songsInQue,
      isPlaying: this.isPlaying,
      volume: this.volume
    };
    return info;
  }

  public getAudioStreamData(): AudioYTData | undefined {
    if (this.currentSong) {
      const currentTimeSong = this.getCurrentTimeSong();
      return {
        ...this.currentSong,
        currentTime: currentTimeSong
      };
    }
  }

  private async getYoutubePlaylistDetailsById(id: string): Promise<PlaylistDetails | undefined> {
    try {
      const foundPlaylist = await this.youtubeAPIHandler.getYoutubePlaylistById(id);

      if (!foundPlaylist) return;

      const details: PlaylistDetails = {
        id: foundPlaylist.id || "",
        name: foundPlaylist.snippet?.title || "",
        count: foundPlaylist.contentDetails?.itemCount || 0
      };

      return details;
    } catch (err) {
      console.error(err);
    }
  }

  private async setCurrentPlaylistNameById(playlistId: string) {
    const playlistDetails = await this.getYoutubePlaylistDetailsById(playlistId);

    if (!playlistDetails) return;
    this.playlistDetails = playlistDetails;
  }

  private async getYoutubeVideosDetailsById(ids: string[]): Promise<SongProperties[] | undefined> {
    const videoDetails = await this.youtubeAPIHandler.getYoutubeVideosById(ids);

    if (!videoDetails) return;

    const foundedVideos = videoDetails?.map<SongProperties>((item) => {
      return {
        id: item.id || "",
        name: item.snippet?.title || "",
        duration: moment.duration(item.contentDetails?.duration || 0).asSeconds()
      };
    });

    // in case where id and name === "" filter;
    const filteredVideos = foundedVideos?.filter((item) => {
      if (item.id.length > 0 && item.name.length > 0) return true;
    });

    return filteredVideos;
  }

  public override pausePlayer() {
    super.pausePlayer("musicYTPause");
  }

  public override changeVolume(volume: number) {
    super.changeVolume(volume, "changeYTVolume");
  }

  private checkIfUserHasAnySongInRequest(user: string) {
    const atLeastOne = this.songRequestList.some(([requester]) => requester.username === user);
    return atLeastOne;
  }

  public sayWhenUserRequestedSong(username: string) {
    if (!this.checkIfUserHasAnySongInRequest(username)) {
      this.clientSay(`@username, you did not add any song to que (: `);

      return;
    }

    const remainingTime = this.getRemainingTimeToRequestedSong(username);

    this.clientSay(`@${username}, your song (${this.getNextUserSongName(username)}) will be in ~${remainingTime}`);
  }
  private async addRequestedSongToPlayer(username: string, song: SongProperties) {
    const { id } = song;
    if (!this.isAlreadySongInQue(id)) {
      const foundUser = await getOneUser({ username }, {});
      if (foundUser) {
        this.songRequestList.push([{ id: foundUser.id, username: username }, song]);
        await this.addSongToQue(song, { id: foundUser.id, username: username });

        await this.addSongToDatabase(song, foundUser._id);
      }
      return true;
    }
  }

  private isAlreadySongInQue(songId: string) {
    const isAdded = this.musicQue.some(([id]) => id === songId);

    if (isAdded || this.currentSong?.id === songId) {
      return true;
    }
  }

  public async requestSong(username: string, songName: string) {
    if (!this.configs.songRequest) {
      this.clientSay(`@${username}, song request is turned off.`);
      return;
    } else if (this.doesUserHaveAvailableRequest(username)) {
      return;
    } else if (!this.isEnoughRequestSongInfo(username, songName)) {
      return;
    }

    const foundSong = await this.searchForRequestedSong(songName);

    if (!foundSong) {
      return this.clientSay(`@${username}, couldn't find any similar songs`);
    } else if (foundSong.duration > this.maxSongDuration) {
      return this.clientSay(
        `@${username}, your song is too long. It exceeds ${convertSecondsToMS(this.maxSongDuration)} minutes`
      );
    }
    const added = await this.addRequestedSongToPlayer(username, foundSong);
    if (added) {
      this.emitGetAudioInfo();
      this.clientSay(`@${username}, added ${foundSong.name} song to que`);
      return;
    }

    this.clientSay(`@${username}, your song is already in que, request something else`);
  }

  private async searchForRequestedSong(searchQuery: string): Promise<SongProperties | undefined> {
    const searchedItem = await this.youtubeAPIHandler.getYoutubeSearchVideosIds({
      q: searchQuery,
      maxResults: 1
    });

    if (!searchedItem) return;

    const videoDetails = await this.getYoutubeVideosDetailsById(searchedItem);

    if (videoDetails) return videoDetails[0];
  }

  private isEnoughRequestSongInfo(username: string, songName: string) {
    if (songName.length > 3) return true;
    this.clientSay(`@${username}, please provide more info SUBprise`);
  }

  private doesUserHaveAvailableRequest(username: string) {
    if (this.haveUserMoreSongsThanRequestLimit(username)) {
      this.clientSay(
        `@${username}, you have already reached song request limit. Wait for them to finish.
        Your song (${this.getNextUserSongName(username)})will be in ~${this.getRemainingTimeToRequestedSong(username)}`
      );
      return true;
    }
  }

  private haveUserMoreSongsThanRequestLimit(username: string) {
    const count: { [key: string]: number } = this.songRequestList.reduce(
      (acc: { [key: string]: number }, [requester]) => {
        acc[requester.username] = (acc[requester.username] || 0) + 1;
        return acc;
      },
      {}
    );

    return count[username] >= this.configs.maxSongRequestByUser;
  }
  private getNextUserSongName(user: string) {
    const foundedRequest = this.songRequestList.find(([requester]) => requester.username === user);
    if (foundedRequest) return foundedRequest[1].name;

    return "No next song, something went wrong Kappa";
  }

  private getRemainingTimeToRequestedSong(username: string) {
    let totalDuration = 0;

    totalDuration += this.getRemainingTimeOfCurrentSong();
    this.musicQue.every(([, audioProps]) => {
      if (audioProps.requester?.username !== username) {
        totalDuration += audioProps.duration;
        return true;
      }
    });

    const [minutes, seconds] = convertSecondsToMS(totalDuration);

    return `${minutes}:${seconds}`;
  }

  private async addSongToDatabase(song: SongProperties, userId: string) {
    return await createSong({
      title: song.name,
      youtubeId: song.id,
      duration: song.duration,
      whoAdded: userId
    });
  }

  public async manageSongLikesByUser(username: string, action: ManageSongLikesAction) {
    if (!this.currentSong) return this.clientSay("No current song. Likes works only when current song is playing");

    const foundUser = await getOneUser({ username: username }, {});

    //TODO: pass this to logger
    if (!foundUser) return console.log("No user found :(");

    await manageSongLikesByYoutubeId(this.currentSong.id, action, foundUser.id);
  }

  private async manageSongUsesByUserId(youtubeId: string, userId: string, isSongRequested: boolean) {
    await updateSongs(
      { youtubeId: youtubeId },
      {
        $inc: { [`usersUses.${userId}`]: 1, uses: 1, ...(isSongRequested ? { songRequestUses: 1 } : { botUses: 1 }) },
        lastUsed: Date.now()
      }
    );
  }
}

export default MusicYTHandler;
