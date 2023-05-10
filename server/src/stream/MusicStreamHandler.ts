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
import { musicPath } from "@configs/globalPaths";
import path from "path";
import { getMp3AudioDuration } from "@utils/filesManipulateUtil";
import { MusicConfigs } from "@models/types";
import MusicHeadHandler from "./MusicHeadHandler";
import { SongProperties } from "./types";

class MusicStreamHandler extends MusicHeadHandler {
  private readonly formatFile: string = ".mp3";
  private currentFolder = musicPath;
  protected override currentSong: AudioStreamData | undefined;
  constructor(
    socketIO: Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >,
    sayInAuthorizedChannel: (message: string) => void,
    configs: MusicConfigs
  ) {
    super(socketIO, sayInAuthorizedChannel, configs, "audio");
  }

  public async init() {}

  protected async addSongToQue(song: SongProperties, requester = "") {
    try {
      const mp3FilePath =
        path.join(this.currentFolder, song.name) + this.formatFile;
      const duration = await getMp3AudioDuration(mp3FilePath);
      const mp3FileBuffer = fs.readFileSync(mp3FilePath);

      const songId = duration.toString() + Date.now();
      this.musicQue.push([
        songId,
        {
          id: songId,
          name: song.name,
          audioBuffer: mp3FileBuffer,
          duration: duration,
          currentTime: 0,
          requester: requester,
        },
      ]);
    } catch (err) {
      console.error(
        "Probably mp3 isn't correct encoded or bad file path. Skip song."
      );

      this.addNextItemToQueAndPushToEnd();
    }
  }

  private async loadSongsFromMusicPath(shuffle = true) {
    try {
      this.songsList = fs
        .readdirSync(this.currentFolder, { withFileTypes: true })
        .filter((file) => file.name.endsWith(this.formatFile))
        .map((file) => {
          return {
            id: file.name.replace(this.formatFile, ""),
            name: file.name.replace(this.formatFile, ""),
            duration: 150,
          };
        });

      if (shuffle) this.shuffleSongs();

      return true;
    } catch {
      return false;
    }
  }

  private shuffleSongs() {
    this.songsList.sort((a, b) => 0.5 - Math.random());
  }

  protected async prepareInitialQue() {
    if (this.songsList.length <= 0) {
      this.clientSay(
        `There are not songs in ${path.basename(this.currentFolder)}`
      );
      return;
    }
    if (this.musicQue.length > 0) this.musicQue.splice(0, this.musicQue.length);
    //clear music que if contain something
    for (let i = 0; i <= this.configs.maxAutoQueSize; i++) {
      await this.addNextItemToQueAndPushToEnd();
    }
  }

  public getAudioInfo(): AudioStreamDataInfo | undefined {
    const songsInQue: [string, string][] = [];

    this.musicQue.forEach(([id, audioProps]) => {
      songsInQue.push([audioProps.name, audioProps.requester || ""]);
    });
    const info: AudioStreamDataInfo = {
      name: this.currentSong?.name || "",
      duration: this.currentSong?.duration || 0,
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

  public getAudioStreamData(): AudioStreamData | undefined {
    if (this.currentSong) {
      const currentTimeSong = this.getCurrentTimeSong();
      return {
        ...this.currentSong,
        currentTime: currentTimeSong,
      };
    }
  }

  private isADirectory(directoryPath: string) {
    try {
      const isDirectory = fs.statSync(directoryPath).isDirectory();
      if (!isDirectory) {
        this.clientSay("Provided folder does not exist32.");
        return;
      }

      return true;
    } catch (err) {
      this.clientSay("Provided folder does not exist.");
    }
  }

  public async loadNewSongs(
    idOrFolderName: string,
    shuffle = true
  ): Promise<void> {
    const loadedFolder = path.join(musicPath, idOrFolderName);
    if (!this.isADirectory(loadedFolder)) return;
    this.currentFolder = loadedFolder;

    try {
      const loaded = await this.loadSongsFromMusicPath(shuffle);
      if (!loaded) return;
      this.clientSay(
        `Loaded new songs from ${idOrFolderName}. Number of songs: ${this.songsList.length}`
      );
      await this.prepareInitialQue();
      this.emitGetAudioInfo();
    } catch (err) {
      this.clientSay(
        `Couldn't load new songs. Probably folder does not exist.`
      );
    }
  }

  protected override emitGetAudioInfo(): void {
    const audioInfo = this.getAudioInfo();
    if (audioInfo) {
      this.socketIO.emit("getAudioInfo", audioInfo);
    }
  }

  public override changeVolume(volume: number) {
    super.changeVolume(volume, "changeVolume");
  }

  public override pausePlayer() {
    super.pausePlayer("audioStop");
  }
}

export default MusicStreamHandler;
