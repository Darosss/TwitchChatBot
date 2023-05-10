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
import { google, youtube_v3 } from "googleapis";
import moment from "moment";
import MusicHeadHandler from "./MusicHeadHandler";
import { shuffleArray } from "@utils/arraysOperationUtiil";
import { SongProperties } from "./types";
import { convertSecondsToMS } from "@utils/convertSecondsToFormatMSUtil";
import { isValidUrl } from "@utils/stringsOperationsUtil";

interface PlaylistDetails {
  id: string;
  name: string;
  count: number;
}

class MusicYTHandler extends MusicHeadHandler {
  private youtube: youtube_v3.Youtube;
  private maxSongDuration = 60 * 10; // 10min; TODO: add to configs
  private playlistDetails: PlaylistDetails = {
    id: "",
    name: "",
    count: 0,
  };
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
    this.youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY_V3,
    });
  }

  protected async addSongToQue(
    song: SongProperties,
    requester = ""
  ): Promise<void> {
    try {
      const { id, name, duration } = song;
      this.musicQue.push([
        id,
        {
          id: id,
          name: name,
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

    this.addSongRequestListIntoQue();
  }

  //TODO: add possibility to take more than 50 items of playlist
  private async addVideosFromCurrentPlaylistIntoSongsList() {
    const videosIds = await this.getYoutubePlaylistItemsById(
      this.playlistDetails.id,
      this.playlistDetails.count
    );
    if (videosIds.length <= 0) return;

    const videosDetails = await this.getYoutubeVideosById(videosIds);

    if (videosDetails) {
      this.clientSay(
        `Loaded ${videosDetails.length} songs from ${this.playlistDetails.name} playlist into que.`
      );
      this.songsList = videosDetails;
    }
  }
  public async loadNewSongs(
    idOrFolderName: string,
    shuffle = false
  ): Promise<void> {
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

  protected getAudioInfo(): AudioYTDataInfo | undefined {
    const songsInQue: [string, string][] = [];

    this.musicQue.forEach(([id, audioProps]) => {
      songsInQue.push([audioProps.name, audioProps.requester || ""]);
    });
    const info: AudioYTDataInfo = {
      name: this.currentSong?.name || "",
      duration: this.currentSong?.duration || 0,
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

  private async getYoutubePlaylistItemsById(
    id: string,
    maxResults = 20
  ): Promise<string[]> {
    try {
      const foundPlaylistItems = await this.youtube.playlistItems.list({
        part: ["id", "snippet", "status"],
        playlistId: id,
        maxResults: maxResults,
      });

      const playlistItems = foundPlaylistItems.data.items;
      if (!playlistItems) return [];

      const videosIds = playlistItems.map((item) => {
        const privacyStatus = item.status?.privacyStatus;
        const videoId = item.snippet?.resourceId?.videoId;

        if (videoId && privacyStatus === "public") return videoId;
        return "";
      });

      return videosIds;
    } catch (err) {
      console.error(err);

      this.clientSay("Playlist isn't a playlist? Clueless");
      return [];
    }
  }

  private async getYoutubePlaylistDetailsById(
    id: string
  ): Promise<PlaylistDetails | undefined> {
    try {
      const foundPlaylist = await this.youtube.playlists.list({
        part: ["id", "snippet", "contentDetails"],
        id: [id],
        maxResults: 1,
      });

      const items = foundPlaylist.data.items!;

      if (items!.length > 0) {
        const details: PlaylistDetails = {
          id: items[0].id!,
          name: items[0].snippet!.title || "",
          count: items[0].contentDetails!.itemCount || 0,
        };

        return details;
      }
    } catch (err) {
      console.error(err);
    }
  }

  private async setCurrentPlaylistNameById(playlistId: string) {
    const playlistDetails = await this.getYoutubePlaylistDetailsById(
      playlistId
    );

    if (!playlistDetails) return;
    this.playlistDetails = playlistDetails;
  }

  private async getYoutubeVideosById(
    ids: string[]
  ): Promise<SongProperties[] | undefined> {
    const videoDetails = await this.youtube.videos.list({
      part: ["contentDetails", "snippet"],
      id: ids,
    });

    const foundedVideos = videoDetails.data.items?.map<SongProperties>(
      (item) => {
        return {
          id: item.id || "",
          name: item.snippet!.title || "",
          duration: moment.duration(item.contentDetails!.duration).asSeconds(),
        };
      }
    );

    const filter = foundedVideos?.filter((item) => {
      if (item.id.length > 0 && item.name.length > 0) return true;
    });

    return filter;
  }

  private async getYoutubeSearchItemsIds(
    opts: youtube_v3.Params$Resource$Search$List
  ): Promise<string[] | undefined> {
    const {
      part = ["snippet"],
      q,
      maxResults = 1,
      videoCategoryId = "10",
    } = opts;
    const searchResult = await this.youtube.search.list({
      part: part,
      q: q,
      type: ["video"],
      videoEmbeddable: "true",
      videoCategoryId: videoCategoryId,
      maxResults: maxResults,
    });

    const items = searchResult.data.items;

    const videosIds = items?.map((item) => {
      const videoId = item.id?.videoId;

      if (videoId) return videoId;
      return "";
    });

    return videosIds;
  }

  public override pausePlayer() {
    super.pausePlayer("musicYTPause");
  }

  public override changeVolume(volume: number) {
    super.changeVolume(volume, "changeYTVolume");
  }

  private checkIfUserHasAnySongInRequest(user: string) {
    const atLeastOne = this.songRequestList.some(
      ([username]) => username === user
    );
    return atLeastOne;
  }

  public sayWhenUserRequestedSong(username: string) {
    if (!this.checkIfUserHasAnySongInRequest(username)) {
      this.clientSay(`@username, you did not add any song to que (: `);

      return;
    }

    const remainingTime = this.getRemainingTimeToRequestedSong(username);

    this.clientSay(
      `@${username}, your song (${this.getNextUserSongName(
        username
      )}) will be in ~${remainingTime}`
    );
  }
  private async addRequestedSongToPlayer(
    username: string,
    song: SongProperties
  ) {
    const { id } = song;
    if (!this.isAlreadySongInQue(id)) {
      this.songRequestList.push([username, song]);
      await this.addSongToQue(song, username);

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
        `@${username}, your song is too long. It exceeds ${convertSecondsToMS(
          this.maxSongDuration
        )}`
      );
    }
    const added = await this.addRequestedSongToPlayer(username, foundSong);
    if (added) {
      this.emitGetAudioInfo();
      this.clientSay(`@${username}, added ${foundSong.name} song to que`);
      return;
    }

    this.clientSay(
      `@${username}, your song is already in que, request something else`
    );
  }

  private async searchForRequestedSong(
    searchQuery: string
  ): Promise<SongProperties | undefined> {
    const searchedItem = await this.getYoutubeSearchItemsIds({
      q: searchQuery,
      maxResults: 1,
    });

    if (!searchedItem) return;

    const videoDetails = await this.getYoutubeVideosById(searchedItem);

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
        Your song (${this.getNextUserSongName(
          username
        )})will be in ~${this.getRemainingTimeToRequestedSong(username)}`
      );
      return true;
    }
  }

  private haveUserMoreSongsThanRequestLimit(username: string) {
    let count: { [key: string]: number } = this.songRequestList.reduce(
      (acc: { [key: string]: number }, [username]) => {
        acc[username] = (acc[username] || 0) + 1;
        return acc;
      },
      {}
    );

    return count[username] >= this.configs.maxSongRequestByUser;
  }
  private getNextUserSongName(user: string) {
    const foundedRequest = this.songRequestList.find(
      ([username]) => username === user
    );
    if (foundedRequest) return foundedRequest[1].name;

    return "No next song, something went wrong Kappa";
  }

  private getRemainingTimeToRequestedSong(username: string) {
    let totalDuration = 0;

    totalDuration += this.getRemainingTimeOfCurrentSong();
    this.musicQue.every(([id, audioProps]) => {
      if (audioProps.requester !== username) {
        totalDuration += audioProps.duration;
        return true;
      }
    });

    const [minutes, seconds] = convertSecondsToMS(totalDuration);

    return `${minutes}:${seconds}`;
  }
}
export default MusicYTHandler;
