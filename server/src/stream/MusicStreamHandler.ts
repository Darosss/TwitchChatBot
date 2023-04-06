import fs from "fs";
import { getAudioDurationInSeconds } from "get-audio-duration";
import { Lame } from "node-lame";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  AudioStreamData,
  AudioStreamDataInfo,
} from "@libs/types";
import moment, { duration } from "moment";

class MusicStreamHandler {
  private songList: string[] = [];
  private musicPath: string;
  private isPlayingTimeout: NodeJS.Timeout | undefined;
  private readonly maxBufferedQue = 3;
  private readonly secondsBetweenAudio = 1;
  private readonly delayBetweenServer = 2;
  private currentSong: AudioStreamData | undefined;
  private currentDelay: number = 0;
  private currentSongStart: Date = new Date();
  private isPlaying: boolean = false;
  private musicQue = new Map<string, AudioStreamData>();
  private readonly socketIO: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
  constructor(
    socketIO: Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >,
    musicPath: string
  ) {
    this.socketIO = socketIO;
    this.musicPath = musicPath;
  }

  public init(format?: string) {
    fs.readdir(this.musicPath, async (err, files) => {
      this.songList = files.filter((x) => x.endsWith(format || "mp3"));
      await this.prepareInitialQue();
      await this.startPlay();
    });
  }

  private shuffleSongs() {
    this.songList.sort((a, b) => 0.5 - Math.random());
  }

  private getFirstFromSongListAndMoveToEnd() {
    const firstElement = this.songList.shift();
    if (!firstElement) return;

    this.songList.push(firstElement);

    return firstElement;
  }

  private async prepareInitialQue(shuffle = true) {
    if (shuffle) this.shuffleSongs();
    for (let i = 0; i < this.maxBufferedQue; i++) {
      const firstElement = this.getFirstFromSongListAndMoveToEnd();
      await this.prepareMusicSong(firstElement);
    }
  }

  private async addNextItemToQueAndPushToEnd() {
    await this.prepareMusicSong(this.songList[0]);
    this.getFirstFromSongListAndMoveToEnd();
  }

  private async prepareMusicSong(file?: string) {
    if (!file) {
      console.log("No file found, cannot prepare to stream");
      return;
    }
    const audioPath = `${this.musicPath}\\${file}`;
    const promises = await Promise.all([
      this.prepareAudioBuffer(audioPath),
      this.getAudioDuration(audioPath),
    ]);
    this.sendAudioInfo();
    const [encoder, duration] = promises;

    const audioBuffer = encoder.getBuffer();
    this.musicQue.set(duration.toString(), {
      name: file.slice(0, -3),
      audioBuffer: audioBuffer,
      duration: duration,
      currentTime: 0,
    });
  }

  private async prepareAudioBuffer(audioPath: string) {
    const encoder = new Lame({ output: "buffer" }).setFile(audioPath);
    await encoder.encode();

    return encoder;
  }

  private async getAudioDuration(audioPath: string) {
    const mp3DurationSec = await getAudioDurationInSeconds(audioPath);
    return mp3DurationSec;
  }

  private setCurrentSongFromQue(newSong = true) {
    if (this.musicQue.size <= 0) return;
    if (newSong || !this.currentSong) {
      this.currentSong
        ? this.musicQue.delete(this.currentSong.duration.toString())
        : null;
      const [id, musicProps] = this.musicQue.entries().next().value;

      this.currentSongStart = new Date();
      this.currentSong = musicProps;

      return true;
    }
  }

  public getAudioInfo(): AudioStreamDataInfo | undefined {
    if (!this.currentSong) return;

    const array = [...this.musicQue.values()];

    const info: AudioStreamDataInfo = {
      name: this.currentSong.name,
      duration: this.currentSong.duration,
      songsInQue: [...array.map((x) => x.name)],
    };
    return info;
  }

  private sendAudioInfo() {
    const audioInfo = this.getAudioInfo();
    if (audioInfo) {
      this.socketIO.emit("getAudioInfo", audioInfo);
    }
  }

  public nextSong() {
    this.clearTimeout();
    this.startPlay(0, true);
  }

  private async startPlay(delay = 0, newSong = false) {
    this.addNextItemToQueAndPushToEnd();
    this.isPlaying = true;
    this.isPlayingTimeout = setTimeout(() => {
      this.setCurrentSongFromQue(newSong);

      if (this.currentSong) {
        this.currentDelay = this.currentSong.duration;
        this.socketIO.emit("audio", this.currentSong);

        const delayNextSong = this.currentDelay - this.currentSong.currentTime;
        this.startPlay(delayNextSong, true);
      }
    }, delay * 1000 + this.secondsBetweenAudio * 1000);
  }

  public stopPlayer() {
    this.clearTimeout();
    //TODO: add clear  current time in current song
  }

  public pausePlayer() {
    const cleared = this.clearTimeout();
    if (!cleared) return;
    if (!this.isPlaying) return;

    const currentTimeSong = this.getCurrentTimeSong();

    if (this.currentSong) {
      this.currentSong.currentTime += currentTimeSong;

      this.socketIO.emit("audioStop");

      this.isPlaying = false;
    }
  }

  public resumePlayer() {
    if (this.isPlaying) return;
    this.currentSongStart = new Date();
    this.startPlay(0);
  }

  public clearTimeout() {
    if (!this.isPlayingTimeout) return false;
    clearTimeout(this.isPlayingTimeout);
    return true;
  }

  private getCurrentTimeSong() {
    const currentTimeSong = moment().diff(this.currentSongStart, "seconds");
    if (currentTimeSong > this.delayBetweenServer)
      return currentTimeSong - this.delayBetweenServer;
    return currentTimeSong;
  }

  public addJoinedClientAsListener(socketId: string) {
    if (this.currentSong) {
      const currentTimeSong = this.getCurrentTimeSong();
      this.socketIO.to(socketId).emit("audio", {
        ...this.currentSong,
        currentTime: currentTimeSong,
      });
    }
  }
}

export default MusicStreamHandler;
