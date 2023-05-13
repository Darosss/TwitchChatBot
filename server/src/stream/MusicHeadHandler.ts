import { Server } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  AudioStreamData,
  AudioStreamDataInfo,
  AudioYTData,
  AudioYTDataInfo
} from "@socket";
import { MusicConfigs } from "@models/types";
import moment from "moment";
import { convertSecondsToMS } from "@utils/convertSecondsToFormatMSUtil";
import { EmitAudioNames, SongProperties, EmitPauseMusic, EmitChangeVolumeMusic } from "./types";

abstract class MusicHeadHandler {
  protected emitName: EmitAudioNames;
  protected isPlaying = false;
  protected songsList: SongProperties[] = [];
  protected songRequestList: [string, SongProperties][] = [];
  protected musicQue: [string, AudioStreamData | AudioYTData][] = [];
  protected isPlayingTimeout: NodeJS.Timeout | undefined;
  protected readonly clientSay: (message: string) => void;
  protected readonly secondsBetweenAudio = 2;
  protected volume = 50;

  protected readonly delayBetweenServer = 2;
  protected currentSongStart: Date = new Date();
  protected currentSong: AudioStreamData | AudioYTData | undefined;
  protected previousSongName = "";
  protected currentDelay = 0;
  protected readonly socketIO: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
  protected configs: MusicConfigs;

  constructor(
    socketIO: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
    sayInAuthorizedChannel: (message: string) => void,
    configs: MusicConfigs,
    emitName: EmitAudioNames
  ) {
    this.socketIO = socketIO;
    this.clientSay = sayInAuthorizedChannel;
    this.configs = configs;
    this.emitName = emitName;
  }

  protected abstract addSongToQue(song: SongProperties, requester?: string): Promise<void>;

  protected abstract prepareInitialQue(): Promise<void>;

  public abstract loadNewSongs(idOrFolderName: string): Promise<void>;

  protected abstract getAudioInfo(): AudioStreamDataInfo | AudioYTDataInfo | undefined;

  public abstract getAudioStreamData(): AudioStreamData | AudioYTData | undefined;

  public async refreshConfigs(configs: MusicConfigs) {
    this.configs = configs;
  }

  protected abstract emitGetAudioInfo(): void;

  public async resumePlayer() {
    if (this.isPlaying || this.musicQue.length <= 0) return;

    this.currentSongStart = new Date();
    this.startPlay(0, false);

    this.clientSay(`Music player resumed!`);
  }

  protected async startPlay(delay = 0, newSong = false) {
    console.log("startplay => ", this.musicQue[0]);
    this.isPlaying = true;
    this.isPlayingTimeout = setTimeout(async () => {
      console.log("***TIMEOUT START****");
      if (!this.currentSong || newSong) {
        console.log("SET CURRENT SONG FROM QUE");
        await this.setCurrentSongFromQue();
      }

      if (this.currentSong) {
        console.log("Current song alreayd is so lets start");
        this.currentDelay = this.currentSong.duration;
        this.socketIO.emit(this.emitName, this.currentSong);

        this.clientSay("Current song: " + this.getNameOfCurrentSong());

        this.emitGetAudioInfo();

        const delayNextSong = this.currentDelay - this.currentSong.currentTime;
        console.log("delaymextsong", delayNextSong * 1000, "testing");
        this.startPlay(delayNextSong * 1000, true);
      }
    }, delay + this.secondsBetweenAudio * 1000);
  }

  protected pausePlayer(emitName: EmitPauseMusic) {
    console.log("INNER PAUSE!!!");
    const cleared = this.clearTimeout();
    if (!cleared || !this.isPlaying) return;

    const currentTimeSong = this.getCurrentTimeSong();

    console.log("Stop current song at", currentTimeSong);
    if (this.currentSong) {
      console.log({
        currTime: this.currentSong.currentTime,
        currTimeSong: currentTimeSong
      });
      this.currentSong.currentTime += currentTimeSong;

      this.socketIO.emit(emitName);

      this.isPlaying = false;

      this.clientSay("Music player paused!");
    }
  }

  public async nextSong() {
    this.clearTimeout();
    this.clientSay("Skip song!");
    this.startPlay(0, true);
  }

  protected clearTimeout() {
    if (!this.isPlayingTimeout) return false;
    clearTimeout(this.isPlayingTimeout);
    return true;
  }

  protected getCurrentTimeSong() {
    const currentTimeSong = moment().diff(this.currentSongStart, "seconds");
    if (currentTimeSong > this.delayBetweenServer) return currentTimeSong - this.delayBetweenServer;
    return currentTimeSong;
  }

  protected async setCurrentSongFromQue() {
    this.previousSongName = this.currentSong?.name || "";
    this.removeFromQue(this.currentSong?.id || "");

    const musicProps = this.getNextSongFromQue();
    if (!musicProps) return;

    this.currentSongStart = new Date();
    this.currentSong = { ...musicProps, volume: this.volume };

    this.removeFromQue(this.currentSong?.id);

    this.clearUserRequestAfterPlay(musicProps.requester);

    if (this.shouldPrepareQue()) await this.addNextItemToQueAndPushToEnd();
  }

  protected async addNextItemToQueAndPushToEnd() {
    const firstSong = this.getFirstFromSongListAndMoveToEnd();
    if (firstSong) {
      console.log("adding songs loading", firstSong);

      await this.addSongToQue(firstSong);
    }
  }

  protected getFirstFromSongListAndMoveToEnd() {
    const firstElement = this.songsList.shift();
    if (!firstElement) return;

    this.songsList.push(firstElement);

    return firstElement;
  }

  protected shouldPrepareQue() {
    if (this.musicQue.length <= this.configs.maxAutoQueSize) return true;
  }

  protected getNextSongFromQue() {
    if (this.musicQue.length <= 0) return;

    const nextMusicProps = this.musicQue[0][1];
    return nextMusicProps;
  }

  protected getNameOfCurrentSong() {
    const audioProps = this.currentSong;
    if (!audioProps) return "Couldn't find song :(";

    let songName = audioProps.name;

    if (audioProps.requester) songName += ` Requested by @${audioProps.requester}`;

    return songName;
  }

  protected removeFromQue(name: string) {
    const index = this.musicQue.findIndex(([id]) => id === name);

    if (index !== -1) {
      this.musicQue.splice(index, 1);
    }
  }

  protected clearUserRequestAfterPlay(username?: string) {
    if (!username) return;

    this.removeFromRequestedQue(username);
  }

  protected removeFromRequestedQue(username: string) {
    const index = this.songRequestList.findIndex(([requester]) => requester === username);

    if (index !== -1) this.songRequestList.splice(index, 1);
  }

  protected addSongRequestListIntoQue() {
    if (this.songRequestList.length > 0) {
      this.songRequestList.forEach(async ([username, song]) => await this.addSongToQue(song, username));
    }
  }

  public changeVolume(volume: number, emitName: EmitChangeVolumeMusic) {
    if (isNaN(volume)) return this.clientSay("Volume must be a number");
    let valueToSet = volume;
    if (volume > 100) valueToSet = 100;
    else if (volume < 0) valueToSet = 0;

    this.volume = valueToSet;
    this.changeVolumeOfCurrentSong(valueToSet);
    this.clientSay(`Volume changed to ${valueToSet}%`);
    this.socketIO.emit(emitName, valueToSet);
  }

  private changeVolumeOfCurrentSong(volume: number) {
    if (!this.currentSong) return;

    this.currentSong = { ...this.currentSong, volume: volume };
  }

  protected getRemainingTimeOfCurrentSong() {
    if (!this.currentSong) return 0;
    const time = Math.floor(this.currentSong.duration - this.getCurrentTimeSong());

    return time;
  }
  public sayNextSong() {
    const nextSong = this.getNextSongFromQue();
    if (!nextSong) {
      this.clientSay("There is no next song");
      return;
    }
    const time = this.getRemainingTimeOfCurrentSong();

    const [minutes, seconds] = convertSecondsToMS(time);

    this.clientSay(
      `Next song: ${nextSong.name} in ~${minutes}:${seconds} min. 
      ${nextSong.requester ? `Requested by ${nextSong.requester}` : ""} 
      `
    );
  }

  public sayPreviousSong() {
    try {
      this.clientSay(`Previous song: ${this.previousSongName}`);
    } catch {
      this.clientSay(`Not enought songs to do that uga buga`);
    }
  }

  public isMusicPlaying() {
    return this.isPlaying;
  }
}

export default MusicHeadHandler;
