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
import moment from "moment";
import path from "path";

class MusicStreamHandler {
  private songList: string[] = [];
  private musicPath: string;
  private isPlayingTimeout: NodeJS.Timeout | undefined;
  private readonly sayInAuthorizedChannel: (message: string) => void;
  private readonly maxBufferedQue = 5;
  private readonly encodedPrefix = `[encoded]`;
  private readonly secondsBetweenAudio = 1;
  private readonly delayBetweenServer = 2;
  private currentSong: AudioStreamData | undefined;
  private currentDelay: number = 0;
  private currentSongStart: Date = new Date();
  private isPlaying: boolean = false;
  private musicQue = new Map<string, AudioStreamData>();
  private currentTime: number = 0;
  private config: { info: boolean } = { info: true }; //TODO: add from config later
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
    sayInAuthorizedChannel: (message: string) => void
  ) {
    this.socketIO = socketIO;
    this.musicPath = path.resolve(__dirname, "../data/music");
    this.sayInAuthorizedChannel = sayInAuthorizedChannel;
  }

  public async init(format?: string) {
    fs.readdir(this.musicPath, async (err, files) => {
      this.songList = files.filter((x) => x.endsWith(format || "mp3"));
      await this.encodeSongs();
      await this.prepareInitialQue();
      await this.startPlay(0, false, true);
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
      console.log("buff", i);
      await this.addNextItemToQueAndPushToEnd();
    }
  }

  private async addNextItemToQueAndPushToEnd() {
    const firstSong = this.getFirstFromSongListAndMoveToEnd();
    if (firstSong) {
      await this.addSongToQue(firstSong);
    }
  }

  private async addSongToQue(audioName: string) {
    const mp3FilePath = `${this.musicPath}\\${audioName}`;
    const duration = await this.getAudioDuration(mp3FilePath);
    const mp3FileBuffer = fs.readFileSync(mp3FilePath);

    this.musicQue.set(duration.toString(), {
      name: audioName.slice(0, -4),
      audioBuffer: mp3FileBuffer,
      duration: duration,
      currentTime: 0,
    });
  }

  private async prepareAudioBuffer(audioName: string) {
    const audioPath = `${this.musicPath}\\${audioName}`;
    const encodedAudioPath = `${this.musicPath}\\${this.encodedPrefix}${audioName}`;

    const encoder = new Lame({ output: "buffer" }).setFile(audioPath);
    await encoder.encode();
    fs.writeFile(encodedAudioPath, encoder.getBuffer(), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Encoded audio saved to ${audioName}`);

      fs.unlink(audioPath, (err) => {
        if (err) {
          console.error("Error deleting audio file:", err);
        } else {
          console.log("Audio file deleted:", audioPath);
        }
      });
    });
  }

  private async encodeSongs() {
    const nonBufferedSongs = this.songList.filter(
      (song) => !song.includes(this.encodedPrefix)
    );
    nonBufferedSongs.forEach((song) => {
      this.prepareAudioBuffer(song);
    });
  }

  private async getAudioDuration(audioPath: string) {
    const mp3DurationSec = await getAudioDurationInSeconds(audioPath);
    return mp3DurationSec;
  }

  private setCurrentSongFromQue(newSong = true) {
    if (this.musicQue.size <= 0) return;
    if (newSong || !this.currentSong) {
      console.log("delete", this.currentSong?.name);

      this.currentSong
        ? this.musicQue.delete(this.currentSong.duration.toString())
        : null;
      const [id, musicProps] = this.musicQue.entries().next().value;

      console.log(musicProps.name, "now");
      this.currentSongStart = new Date();
      this.currentSong = {
        ...musicProps,
        name: this.removeEncodedPrefixFromName(musicProps.name),
      };

      return true;
    }
  }
  private removeEncodedPrefixFromName(name: string) {
    return name.replace(this.encodedPrefix, "");
  }
  public getAudioInfo(): AudioStreamDataInfo | undefined {
    if (!this.currentSong) return;

    const array = [...this.musicQue.values()];

    const info: AudioStreamDataInfo = {
      name: this.removeEncodedPrefixFromName(this.currentSong.name),
      duration: this.currentSong.duration,
      songsInQue: [
        ...array.map((x) => this.removeEncodedPrefixFromName(x.name)),
      ],
    };
    return info;
  }

  private sendAudioInfo() {
    const audioInfo = this.getAudioInfo();
    if (audioInfo) {
      this.socketIO.emit("getAudioInfo", audioInfo);
    }
  }

  public async nextSong(sayInfo = false) {
    this.clearTimeout();
    this.startPlay(0, true, sayInfo);
  }

  private getNameOfNextSongInQue() {
    try {
      const audioProps = [...this.musicQue.values()][0];
      if (!audioProps) return "Couldn't find song :(";

      return this.removeEncodedPrefixFromName(audioProps.name);
    } catch {
      return "Not enought songs in que";
    }
  }

  private async startPlay(delay = 0, newSong = false, sayInfo = false) {
    this.isPlaying = true;
    this.sendAudioInfo();
    this.isPlayingTimeout = setTimeout(async () => {
      await this.addNextItemToQueAndPushToEnd();

      this.setCurrentSongFromQue(newSong);

      if (this.currentSong) {
        this.currentDelay = this.currentSong.duration;
        this.socketIO.emit("audio", this.currentSong);

        sayInfo
          ? this.sayInAuthorizedChannel(
              "Current song: " + this.getNameOfNextSongInQue()
            )
          : null;
        console.log(
          `Play - ${this.currentSong?.name} - with delay: ${this.currentDelay}`
        );
        const delayNextSong = this.currentDelay - this.currentSong.currentTime;
        console.log("delay next song ", delayNextSong);
        this.startPlay(delayNextSong, true, this.config.info);
      }
    }, delay * 1000 + this.secondsBetweenAudio * 1000);
  }

  public stopPlayer() {
    this.clearTimeout();
    //TODO: add clear  current time in current song
  }

  public pausePlayer(sayInfo = false) {
    const cleared = this.clearTimeout();
    if (!cleared) return;
    console.log(this.isPlaying, "gra czy nie");
    if (!this.isPlaying) return;

    const currentTimeSong = this.getCurrentTimeSong();

    console.log("Stop current song at", currentTimeSong);
    if (this.currentSong) {
      console.log({
        currTime: this.currentSong.currentTime,
        currTimeSong: currentTimeSong,
      });
      this.currentSong.currentTime += currentTimeSong;

      this.socketIO.emit("audioStop");

      this.isPlaying = false;

      if (sayInfo) {
        this.sayInAuthorizedChannel("Music player paused!");
      }
    }
  }

  public async resumePlayer(sayInfo = false) {
    if (this.isPlaying) return;
    this.currentSongStart = new Date();
    this.startPlay(0, false, this.config.info);

    if (sayInfo) this.sayInAuthorizedChannel(`Music player resumed! `);
  }

  public clearTimeout() {
    if (!this.isPlayingTimeout) return false;
    console.log("clear timeout");
    clearTimeout(this.isPlayingTimeout);
    return true;
  }

  private getCurrentTimeSong() {
    const currentTimeSong = moment().diff(this.currentSongStart, "seconds");
    if (currentTimeSong > this.delayBetweenServer)
      return currentTimeSong - this.delayBetweenServer;
    return currentTimeSong;
  }

  public getAudioStreamData(): AudioStreamData | undefined {
    if (this.currentSong) {
      console.log("PLAY ON CLIENT JOIN");
      const currentTimeSong = this.getCurrentTimeSong();
      return {
        ...this.currentSong,
        currentTime: currentTimeSong,
      };
    }
  }
}

export default MusicStreamHandler;
