import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  AudioStreamData,
  AudioStreamDataInfo,
  AudioYTData,
  AudioYTDataInfo,
} from "@libs/types";
import { MusicConfigs } from "@models/types";
import moment from "moment";

type EmitAudioNames = "audio" | "audioYT";
type EmitPauseMusic = "audioStop" | "musicYTPause";
type EmitChangeVolumeMusic = "changeVolume" | "changeYTVolume";

abstract class MusicHeadHandler {
  protected emitName: EmitAudioNames;
  protected isPlaying = false;
  protected songsList: [string, number][] = [];
  protected songRequestList: [string, string][] = [];
  protected musicQue: [string, AudioStreamData | AudioYTData][] = [];
  protected isPlayingTimeout: NodeJS.Timeout | undefined;
  protected readonly clientSay: (message: string) => void;
  protected readonly secondsBetweenAudio = 2;
  protected volume: number = 50;

  protected readonly delayBetweenServer = 2;
  protected currentSongStart: Date = new Date();
  protected currentSong: AudioStreamData | AudioYTData | undefined;
  protected previousSongName: string = "";
  protected currentDelay: number = 0;
  protected readonly socketIO: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
  protected configs: MusicConfigs;

  constructor(
    socketIO: Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >,
    sayInAuthorizedChannel: (message: string) => void,
    configs: MusicConfigs,
    emitName: EmitAudioNames
  ) {
    this.socketIO = socketIO;
    this.clientSay = sayInAuthorizedChannel;
    this.configs = configs;
    this.emitName = emitName;
  }

  protected abstract addSongToQue(
    song: [string, number],
    requester?: string
  ): Promise<void>;

  protected abstract prepareInitialQue(): Promise<void>;

  public abstract loadNewSongs(idOrFolderName: string): Promise<void>;

  protected abstract getAudioInfo():
    | AudioStreamDataInfo
    | AudioYTDataInfo
    | undefined;

  public async refreshConfigs(configs: MusicConfigs) {
    this.configs = configs;
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

        // this.clientSay("Current song: " + this.getNameOfCurrentSong());

        this.sendAudioInfo();

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
        currTimeSong: currentTimeSong,
      });
      this.currentSong.currentTime += currentTimeSong;

      this.socketIO.emit(emitName);

      this.isPlaying = false;

      // this.clientSay("Music player paused!");
    }
  }

  public async nextSong() {
    this.clearTimeout();
    // this.sayInChannel(sayInfo, "Skip song!");
    this.startPlay(0, true);
  }

  protected clearTimeout() {
    if (!this.isPlayingTimeout) return false;
    clearTimeout(this.isPlayingTimeout);
    return true;
  }

  protected getCurrentTimeSong() {
    const currentTimeSong = moment().diff(this.currentSongStart, "seconds");
    if (currentTimeSong > this.delayBetweenServer)
      return currentTimeSong - this.delayBetweenServer;
    return currentTimeSong;
  }

  protected async setCurrentSongFromQue() {
    this.previousSongName = this.currentSong?.name || "";
    // this.musicQue.delete(this.currentSong?.id || "");
    this.removeFromQue(this.currentSong?.id || "");

    const musicProps = this.getNextSongFromQue();
    if (!musicProps) return;

    this.currentSongStart = new Date();
    this.currentSong = musicProps;

    // this.musicQue.delete(this.currentSong.id);
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

    if (audioProps.requester)
      songName += ` Requested by @${audioProps.requester}`;

    return songName;
  }

  protected removeFromQue(name: string) {
    let index = this.musicQue.findIndex(([id]) => id === name);

    if (index !== -1) {
      this.musicQue.splice(index, 1);
    }
  }

  protected clearUserRequestAfterPlay(username?: string) {
    if (username) {
      console.log("USERNAME???");
      // this.songRequestList.delete(username);
      this.removeFromRequestedQue(username);
    }
  }

  protected removeFromRequestedQue(username: string) {
    let index = this.songRequestList.findIndex(
      ([username]) => username === username
    );

    if (index !== -1) this.songRequestList.splice(index, 1);
  }

  protected sendAudioInfo() {
    console.log("send audio info 33344444");
    const audioInfo = this.getAudioInfo();
    if (audioInfo) {
      this.socketIO.emit("getAudioYTInfo", audioInfo);
    }
  }

  public async resumePlayer() {
    if (this.isPlaying || this.songsList.length <= 0) return;

    this.currentSongStart = new Date();
    this.startPlay(0, false);

    // this.clientSay(`Music player resumed!`);
  }

  public changeVolume(volume: number, emitName: EmitChangeVolumeMusic) {
    if (isNaN(volume)) return this.clientSay("Volume must be a number");
    let valueToSet = volume;
    if (volume > 100) valueToSet = 100;
    else if (volume < 0) valueToSet = 0;

    this.volume = valueToSet;
    this.clientSay(`Volume changed to ${valueToSet}%`);
    this.socketIO.emit(emitName, valueToSet);
  }
}

export default MusicHeadHandler;
