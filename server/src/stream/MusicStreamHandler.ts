import fs from "fs";
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
import { convertSecondsToMS } from "@utils/convertSecondsToFormatMSUtil";
import { musicPath } from "@configs/globalPaths";
import path from "path";
import { getMp3AudioDuration } from "@utils/filesManipulateUtil";

class MusicStreamHandler {
  private songList: string[] = [];
  private songRequestList = new Map<string, string>();
  private isPlayingTimeout: NodeJS.Timeout | undefined;
  private readonly clientSay: (message: string) => void;
  private readonly formatFile: string = "mp3";
  private readonly maxBufferedQue = 3;
  private readonly secondsBetweenAudio = 1;
  private readonly delayBetweenServer = 2;
  private currentFolder = musicPath;
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
    this.clientSay = sayInAuthorizedChannel;
  }

  public async init() {
    await this.loadSongsFromMusicPath();
  }

  private async loadSongsFromMusicPath(shuffle = true) {
    try {
      this.songList = fs
        .readdirSync(this.currentFolder, { withFileTypes: true })
        .filter((file) => file.name.endsWith(this.formatFile))
        .map((file) => file.name.replace(this.formatFile, ""));

      if (shuffle) this.shuffleSongs();

      return true;
    } catch {
      return false;
    }
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

  private async prepareInitialQue() {
    if (this.songList.length <= 0) {
      this.clientSay(
        `There are not songs in ${path.basename(this.currentFolder)}`
      );
      return;
    }
    if (this.musicQue.size > 0) this.musicQue.clear();

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
    if (say) this.clientSay(message);
  }

  private async addSongToQue(audioName: string, requester = "") {
    try {
      const mp3FilePath =
        path.join(this.currentFolder, audioName) + this.formatFile;
      const duration = await getMp3AudioDuration(mp3FilePath);
      const mp3FileBuffer = fs.readFileSync(mp3FilePath);

      const songId = duration.toString() + Date.now();
      this.musicQue.set(songId, {
        id: songId,
        name: audioName,
        audioBuffer: mp3FileBuffer,
        duration: duration,
        currentTime: 0,
        requester: requester,
      });
    } catch (err) {
      console.error(
        "Probably mp3 isn't correct encoded or bad file path. Skip song."
      );

      this.addNextItemToQueAndPushToEnd();
    }
  }

  private getNextSongFromQue() {
    const musicPropsMapValue = this.musicQue.values().next().value;
    if (!musicPropsMapValue) return;
    const musicProps = musicPropsMapValue as AudioStreamData;

    return musicProps;
  }

  private async setCurrentSongFromQue() {
    this.previousSong = this.currentSong?.name || "";
    this.musicQue.delete(this.currentSong?.id || "");

    const musicProps = this.getNextSongFromQue();
    if (!musicProps) return;

    this.currentSongStart = new Date();
    this.currentSong = musicProps;

    this.musicQue.delete(this.currentSong.id);

    this.clearUserRequestAfterPlay(musicProps.requester);

    if (this.shouldPrepareQue()) await this.addNextItemToQueAndPushToEnd();
  }

  public getAudioInfo(): AudioStreamDataInfo | undefined {
    if (!this.currentSong) return;

    const queArray = [...this.musicQue.values()];
    const songsInQue: [string, string][] = [];

    queArray.forEach((song) => {
      songsInQue.push([song.name, song.requester || ""]);
    });
    const info: AudioStreamDataInfo = {
      name: this.currentSong.name,
      duration: this.currentSong.duration,
      currentTime: this.getCurrentTimeSong(),
      songsInQue: songsInQue,
      isPlaying: this.isPlaying,
      currentFolder:
        this.currentFolder !== musicPath
          ? path.basename(this.currentFolder)
          : "",
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

    let songName = audioProps.name;

    if (audioProps.requester)
      songName += ` Requested by @${audioProps.requester}`;

    return songName;
  }

  private shouldPrepareQue() {
    if (this.musicQue.size <= this.maxBufferedQue) return true;
  }

  private isADirectory(directoryPath: string, sayInfo = false) {
    try {
      const isDirectory = fs.statSync(directoryPath).isDirectory();
      if (!isDirectory) {
        this.sayInChannel(sayInfo, "Provided folder does not exist32.");
        return;
      }

      return true;
    } catch (err) {
      this.sayInChannel(sayInfo, "Provided folder does not exist.");
    }
  }

  public loadNewSongs(folderName: string, sayInfo = false, shuffle = true) {
    const loadedFolder = path.join(musicPath, folderName);
    if (!this.isADirectory(loadedFolder, sayInfo)) return;
    this.currentFolder = loadedFolder;
    this.loadSongsFromMusicPath(shuffle)
      .then(async () => {
        this.sayInChannel(
          sayInfo,
          `Loaded new songs from ${folderName}. Number of songs: ${this.songList.length}`
        );
        await this.prepareInitialQue();
        this.sendAudioInfo();
      })
      .catch(() => {
        this.sayInChannel(
          sayInfo,
          `Couldn't load new songs. Probably folder does not exist.`
        );
      });
  }

  private async startPlay(delay = 0, newSong = false, sayInfo = false) {
    this.isPlaying = true;
    this.isPlayingTimeout = setTimeout(async () => {
      if (this.musicQue.size > 0 || newSong) {
        await this.setCurrentSongFromQue();
      }

      if (this.currentSong) {
        this.currentDelay = this.currentSong.duration;
        this.socketIO.emit("audio", this.currentSong);

        this.sayInChannel(
          sayInfo,
          "Current song: " + this.getNameOfCurrentSong()
        );

        this.sendAudioInfo();

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
    const added = await this.addRequestedSongToPlayer(username, foundSong);
    if (added) {
      this.sendAudioInfo();
      this.sayInChannel(
        sayInfo,
        `@${username}, added ${foundSong} song to que`
      );
      return;
    }

    this.sayInChannel(
      sayInfo,
      `@${username}, your song is already in que, request something else`
    );
  }

  private async addRequestedSongToPlayer(username: string, songName: string) {
    if (!this.isAlreadySongInQue(songName)) {
      this.songRequestList.set(username, songName);
      await this.addSongToQue(songName, username);

      return true;
    }
  }

  private isAlreadySongInQue(songName: string) {
    const isAdded = [...this.musicQue.values()].some(
      (song) => song.name === songName
    );

    return isAdded;
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
      this.sayInChannel(
        sayInfo,
        `@${username}, you have already added song. 
        Your song will be in ~${this.getRemainingTimeToRequestedSong(username)}`
      );
      return true;
    }
  }

  private checkIfSongExist(songName: string) {
    return this.songList.find((x) =>
      x.toLowerCase().includes(songName.toLowerCase())
    );
  }

  private clearUserRequestAfterPlay(username?: string) {
    if (username) {
      this.songRequestList.delete(username);
    }
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
    if (this.isPlaying || this.songList.length <= 0) return;
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
      this.clientSay(`Previous song: ${this.previousSong}`);
    } catch {
      this.clientSay(`Not enought songs to do that uga buga`);
    }
  }
  public sayWhenUserRequestedSong(username: string) {
    if (!this.isAddedSongByUser(username)) {
      this.clientSay(`@username, you did not add any song to que (: `);

      return;
    }

    const remainingTime = this.getRemainingTimeToRequestedSong(username);

    this.clientSay(`@${username}, your song will be in ~${remainingTime}`);
  }

  private getRemainingTimeToRequestedSong(username: string) {
    let totalDuration = 0;

    totalDuration += this.getRemainingTimeOfCurrentSong();
    [...this.musicQue.values()].every((song) => {
      if (song.requester !== username) {
        totalDuration += song.duration;
        return true;
      }
    });

    const [minutes, seconds] = convertSecondsToMS(totalDuration);

    return `${minutes}:${seconds}`;
  }
}

export default MusicStreamHandler;
