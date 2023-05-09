import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
  AudioYTDataInfo,
  AudioYTData,
} from "@libs/types";
import { MusicConfigs } from "@models/types";
import { google } from "googleapis";
import moment from "moment";
import MusicHeadHandler from "./MusicHeadHandler";
import { shuffleArray } from "@utils/arraysOperationUtiil";

class MusicYTHandler extends MusicHeadHandler {
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
    super(socketIO, sayInAuthorizedChannel, configs, "audioYT");
  }

  protected async addSongToQue(
    song: [string, string, number],
    requester = ""
  ): Promise<void> {
    try {
      const [id, title, duration] = song;
      this.musicQue.push([
        id,
        {
          id: id,
          name: title,
          duration: duration,
          currentTime: 0,
          requester: requester,
        },
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
  }

  public async loadNewSongs(
    idOrFolderName: string,
    shuffle = false
  ): Promise<void> {
    if (shuffle) this.songsList = shuffleArray(this.songsList);
    //add get from playlist xd

    await this.prepareInitialQue();
  }

  protected getAudioInfo(): AudioYTDataInfo | undefined {
    console.log("get audio nfo 555");
    if (!this.currentSong) return;

    const songsInQue: [string, string][] = [];

    this.musicQue.forEach(([id, audioProps]) => {
      songsInQue.push([audioProps.name, audioProps.requester || ""]);
    });
    const info: AudioYTDataInfo = {
      name: this.currentSong.name,
      duration: this.currentSong.duration,
      currentTime: this.getCurrentTimeSong(),
      songsInQue: songsInQue,
      isPlaying: this.isPlaying,
    };
    return info;
  }

  public getAudioStreamData(): AudioYTData | undefined {
    if (this.currentSong) {
      const currentTimeSong = this.getCurrentTimeSong();
      return {
        ...this.currentSong,
        currentTime: currentTimeSong,
      };
    }
  }

  public async init() {
    const youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY_V3,
    });
    youtube.playlistItems
      .list({
        part: ["id", "snippet", "status"],
        playlistId: "PLCSjw-UETkjQadNO859RPc7EB6AceRrKB",
        maxResults: 20,
      })
      .then((response) => {
        const items = response.data.items;
        if (!items) return [];

        const videosIds = items.map((item) => {
          const privacyStatus = item.status?.privacyStatus;
          const videoId = item.snippet?.resourceId?.videoId;

          if (videoId && privacyStatus === "public") return videoId;
          return "";
        });

        youtube.videos
          .list({
            part: ["contentDetails", "snippet"],
            id: videosIds,
          })
          .then((results) => {
            results.data.items?.forEach((item) => {
              if (
                item.contentDetails?.duration &&
                item.id &&
                item.snippet?.title
              )
                this.songsList.push([
                  item.id,
                  item.snippet.title,
                  moment.duration(item.contentDetails?.duration).asSeconds(),
                ]);
            });
          });
      })
      .catch((err) => {
        console.error("Error searching for videos:", err);
      })
      .finally(() => {});
  }

  public pausePlayer() {
    console.log("pause");
    super.pausePlayer("musicYTPause");
  }

  public changeVolume(volume: number) {
    super.changeVolume(volume, "changeYTVolume");
  }

  public sayWhenUserRequestedSong(username: string) {
    throw new Error("sayWhenUserRequestedSong not implemented yet");
  }

  public async requestSong(username: string, songName: string) {
    throw new Error("requestSong not implemented yet");
  }
}

export default MusicYTHandler;
