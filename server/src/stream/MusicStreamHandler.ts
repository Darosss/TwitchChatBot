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
import { convertSecondsToMS } from "@utils/convertSecondsToFormatMSUtil";

class MusicStreamHandler {
  private songList: string[] = [];
  private songRequestList = new Map<string, string>();
  private musicPath: string;
  private isPlayingTimeout: NodeJS.Timeout | undefined;
  private readonly sayInAuthorizedChannel: (message: string) => void;
  private readonly formatFile: string = "mp3";
  private readonly maxBufferedQue = 3;
  private readonly encodedPrefix = `[encoded]`;
  private readonly secondsBetweenAudio = 1;
  private readonly delayBetweenServer = 2;
  private currentSong: AudioStreamData | undefined;
  private previousSong: string = "";
  private currentDelay: number = 0;
  private currentSongStart: Date = new Date();
  private isPlaying: boolean = false;
  private musicQue = new Map<string, AudioStreamData>();
  private currentTime: number = 0;
  private config: { info: boolean; songRequest: boolean } = {
    info: true,
    songRequest: true,
  }; //TODO: add from config later
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

    setInterval(() => {
      // console.log(this.sayWhenUserRequestedSong());
    }, 2500);
  }

  public async init() {
    const files = fs
      .readdirSync(this.musicPath, { withFileTypes: true })
      .filter((file) => file.name.endsWith(this.formatFile))
      .map((file) => file.name.replace(this.formatFile, ""));

    await this.encodeSongs(files);

    this.songList = files
      .filter((file) => file.startsWith(this.encodedPrefix))
      .map((file) => file.replace(this.encodedPrefix, ""));

    await this.prepareInitialQue();
    await this.startPlay(0, false, true);
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
    for (let i = 0; i <= this.maxBufferedQue; i++) {
      await this.addNextItemToQueAndPushToEnd();
    }
  }

  private async addNextItemToQueAndPushToEnd() {
    const firstSong = this.getFirstFromSongListAndMoveToEnd();
    if (firstSong) {
      await this.addSongToQue(firstSong);
    }
  }

  private sayInChannel(say = false, message: string) {
    if (say) this.sayInAuthorizedChannel(message);
  }

  private async addSongToQue(audioName: string, requester = "") {
    try {
      const mp3FilePath = `${this.musicPath}\\${this.encodedPrefix}${audioName}${this.formatFile}`;
      const duration = await this.getAudioDuration(mp3FilePath);
      const mp3FileBuffer = fs.readFileSync(mp3FilePath);

      this.musicQue.set(duration.toString(), {
        name: audioName,
        audioBuffer: mp3FileBuffer,
        duration: duration,
        currentTime: 0,
        requester: requester,
      });

      this.sendAudioInfo();
    } catch (err) {
      console.error("Probably mp3 isn't correct encoded. Skip song.");

      this.addNextItemToQueAndPushToEnd();
    }
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

  private async encodeSongs(files: string[]) {
    files.forEach(async (file) => {
      if (!file.startsWith(this.encodedPrefix))
        await this.prepareAudioBuffer(file);
    });
  }

  private async getAudioDuration(audioPath: string) {
    const mp3DurationSec = await getAudioDurationInSeconds(audioPath);
    return mp3DurationSec;
  }

  private async setCurrentSongFromQue(newSong = true) {
    if (this.musicQue.size <= 0) return;
    if (newSong || !this.currentSong) {
      this.previousSong = this.currentSong?.name || "";
      this.musicQue.delete(this.currentSong?.duration.toString() || "");

      const [id, musicProps] = [...this.musicQue][0];
      this.currentSongStart = new Date();

      this.currentSong = {
        ...musicProps,
        name: this.removeEncodedPrefixFromName(musicProps.name),
      };

      this.musicQue.delete(this.currentSong?.duration.toString() || "");
      if (musicProps.requester)
        this.clearUserRequestAfterPlay(musicProps.requester);
      if (this.shouldPrepareQue()) await this.addNextItemToQueAndPushToEnd();
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
      currentTime: this.getCurrentTimeSong(),
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
    this.sayInChannel(sayInfo, "Skip song!");
    this.startPlay(0, true, sayInfo);
  }

  private getNameOfCurrentSong() {
    const audioProps = this.currentSong;
    if (!audioProps) return "Couldn't find song :(";

    let songName = this.removeEncodedPrefixFromName(audioProps.name);

    if (audioProps.requester)
      songName += ` Requested by @${audioProps.requester}`;

    return songName;
  }

  private shouldPrepareQue() {
    if (this.musicQue.size < this.maxBufferedQue) return true;
  }

  private async startPlay(delay = 0, newSong = false, sayInfo = false) {
    this.isPlaying = true;
    this.isPlayingTimeout = setTimeout(async () => {
      this.setCurrentSongFromQue(newSong);

      if (this.currentSong) {
        this.currentDelay = this.currentSong.duration;
        this.socketIO.emit("audio", this.currentSong);

        this.sayInChannel(
          sayInfo,
          "Current song: " + this.getNameOfCurrentSong()
        );

        const delayNextSong = this.currentDelay - this.currentSong.currentTime;
        this.startPlay(delayNextSong, true, this.config.info);
      }
    }, delay * 1000 + this.secondsBetweenAudio * 1000);
  }

  public stopPlayer() {
    this.clearTimeout();
    //TODO: add clear  current time in current song
  }

  public async requestSong(
    username: string,
    songName: string,
    sayInfo = false
  ) {
    if (!this.config.songRequest) {
      this.sayInChannel(sayInfo, `@${username}, song request is turned off.`);
      return;
    } else if (this.isAddedSongByUser(username, sayInfo)) {
      return;
    } else if (!this.isEnoughRequestSongInfo(username, songName, sayInfo)) {
      return;
    }
    const foundSong = this.checkIfSongExist(songName);
    if (!foundSong) {
      this.sayInChannel(
        sayInfo,
        `@${username}, couldn't find any similar songs`
      );
      return;
    }
    await this.addRequestedSongToPlayer(username, foundSong);

    this.sayInChannel(sayInfo, `@${username}, added ${foundSong} song to que`);
  }

  private async addRequestedSongToPlayer(username: string, songName: string) {
    this.songRequestList.set(username, songName);

    await this.addSongToQue(songName, username);
  }

  private isEnoughRequestSongInfo(
    username: string,
    songName: string,
    sayInfo = false
  ) {
    if (songName.length > 3) return true;
    this.sayInChannel(
      sayInfo,
      `@${username}, please provide more info SUBprise`
    );
  }

  private isAddedSongByUser(username: string, sayInfo = false) {
    if (this.songRequestList.has(username)) {
      this.sayInChannel(sayInfo, `@${username}, you have already added song`);
      return true;
    }
  }

  private checkIfSongExist(songName: string) {
    return this.songList.find((x) =>
      x.toLowerCase().includes(songName.toLowerCase())
    );
  }

  private clearUserRequestAfterPlay(username: string) {
    this.songRequestList.delete(username);
  }

  public pausePlayer(sayInfo = false) {
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

      this.socketIO.emit("audioStop");

      this.isPlaying = false;

      this.sayInChannel(sayInfo, "Music player paused!");
    }
  }

  public async resumePlayer(sayInfo = false) {
    if (this.isPlaying) return;
    this.currentSongStart = new Date();
    this.startPlay(0, false, this.config.info);

    this.sayInChannel(sayInfo, `Music player resumed!`);
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

  public getAudioStreamData(): AudioStreamData | undefined {
    if (this.currentSong) {
      const currentTimeSong = this.getCurrentTimeSong();
      return {
        ...this.currentSong,
        currentTime: currentTimeSong,
      };
    }
  }

  private getRemainingTimeOfCurrentSong() {
    if (!this.currentSong) return 0;
    const time = Math.floor(
      this.currentSong.duration - this.getCurrentTimeSong()
    );

    return time;
  }

  public sayNextSong() {
    const nextSong = this.musicQue.values().next().value as AudioStreamData;
    const time = this.getRemainingTimeOfCurrentSong();

    const [minutes, seconds] = convertSecondsToMS(time);

    this.sayInAuthorizedChannel(
      `Next song: ${nextSong.name} in ~${minutes}:${seconds} min`
    );
  }
  public sayPreviousSong() {
    try {
      this.sayInAuthorizedChannel(`Previous song: ${this.previousSong}`);
    } catch {
      this.sayInAuthorizedChannel(`Not enought songs to do that uga buga`);
    }
  }
  public sayWhenUserRequestedSong(username: string) {
    if (!this.isAddedSongByUser(username)) {
      this.sayInAuthorizedChannel(
        `@username, you did not add any song to que (: `
      );

      return;
    }

    const remainingTime = this.getRemainingTimeToRequestedSong(username);

    this.sayInAuthorizedChannel(
      `@${username}, your song will be in ~${remainingTime}`
    );
  }

  private getRemainingTimeToRequestedSong(username: string) {
    let totalDuration = 0;

    totalDuration += this.getRemainingTimeOfCurrentSong();
    [...this.musicQue.values()].every((song) => {
      if (song.requester !== username) {
        console.log(Math.floor(totalDuration), song.duration, song.requester);
        totalDuration += song.duration;
        return true;
      }
    });

    const [minutes, seconds] = convertSecondsToMS(totalDuration);

    return `${minutes}:${seconds}`;
  }
}

export default MusicStreamHandler;
