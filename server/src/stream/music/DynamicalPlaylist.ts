import { QueueHandler } from "../QueueHandler";
import youtubeMusic from "./YoutubeMusic";
import { isValidUrl, isADirectory, musicLogger } from "@utils";
import localMusic from "./LocalMusic";
import { botId, musicFolderName, musicPath, ytMusicFolderName } from "@configs";
import path from "path";
import { createSong, updateSongUsesById, getOneUser } from "@services";
import { YoutubeSongProperties } from "./types";
import { SongProperties } from "@socket";

interface PlaylistDetails {
  id: string;
  name: string;
  count: number;
  type?: "local" | "yt";
}

export class DynamicalPlaylist extends QueueHandler<YoutubeSongProperties> {
  private botDatabaseId: string | null = null;
  private playlistDetails: PlaylistDetails = {
    id: "",
    name: "",
    count: 0
  };

  constructor() {
    super();

    getOneUser({ twitchId: botId }, {}).then((user) => {
      if (!user) throw new Error(`DynamicalPlaylist -> Bot user not found in db`);
      this.botDatabaseId = String(user._id);
    });
  }
  /**
   *
   * @param pushToEnd - whether to push retrieved song to end
   * @returns - next song data
   */
  public getNextSongData(pushToEnd?: boolean) {
    const nextSongData = this.dequeue();
    if (nextSongData && pushToEnd) this.enqueue(nextSongData);

    nextSongData ? this._handleDBSongLogic(nextSongData) : null;

    return nextSongData;
  }
  /**
   * @param length - how much songs need (duplicated too)
   * @param pushToEnd - whether to push retrieved song to end
   * @returns - next song data
   */
  public async getSongs(length: number, pushToEnd?: boolean): Promise<SongProperties[]> {
    const songsToAdd: SongProperties[] = [];

    if (this.getLength() <= 0) {
      musicLogger.info("There are 0 songs for add to que");
      return songsToAdd;
    }
    for (let i = 0; i < length; i++) {
      const nextSongData = this.getNextSongData(pushToEnd);
      if (!nextSongData) break;

      songsToAdd.push(nextSongData);
    }

    return songsToAdd;
  }

  private async _handleDBSongLogic(songData: YoutubeSongProperties) {
    if (!this.botDatabaseId) throw Error(`_handleDBSongLogic -> Bot database ID not found`);
    const isYoutubeSong = this.playlistDetails.type !== "local";
    const createData = await createSong({
      duration: songData.duration,
      whoAdded: String(this.botDatabaseId),
      title: songData.name,
      youtubeId: isYoutubeSong ? songData.id : undefined,
      localSong: !isYoutubeSong ? true : undefined,
      downloadedData: songData.downloadedData,
      tags: youtubeMusic.convertTopicDetailsIntoTags(songData.topicDetails)
    });

    isYoutubeSong ? await youtubeMusic.downloadSongAndUpdateDBData(songData, this.botDatabaseId) : null;

    if (!createData) return musicLogger.error("Couldn't handle _handleDBSongLogic, no creteData");
    await updateSongUsesById(createData.song._id, "botUses");
  }

  //TODO: add possibility to take more than 50 items of playlist
  private async addVideosFromCurrentPlaylistIntoSongsList() {
    const videosIds = await youtubeMusic.getYoutubePlaylistVideosIds(
      this.playlistDetails.id,
      this.playlistDetails.count
    );
    if (videosIds.length <= 0) return;

    const videosDetails = await youtubeMusic.getYoutubeVideosDetailsById(videosIds);

    if (videosDetails && videosDetails.length > 0) {
      this.clear();
      for await (const songDetails of videosDetails) {
        this.enqueue({
          ...songDetails,
          downloadedData: {
            fileName: songDetails.id + ".mp3",
            folderName: ytMusicFolderName,
            publicPath: path.join(musicFolderName, ytMusicFolderName, songDetails.id + ".mp3")
          }
        });
      }
    }
  }
  private async setCurrentPlaylistNameById(playlistId: string) {
    const playlistDetails = await this.getYoutubePlaylistDetailsById(playlistId);

    if (!playlistDetails) return;
    this.playlistDetails = playlistDetails;
  }

  private async setCurrentPlaylistNameBySearch(searchName: string) {
    const playlistDetails = await this.getYoutubePlaylistDetailsBySearch(searchName);
    if (!playlistDetails) return;
    this.playlistDetails = playlistDetails;
  }

  private async getYoutubePlaylistDetailsBySearch(searchName: string) {
    const playlistData = (await youtubeMusic.searchYoutubePlaylistByName(searchName, 1))?.at(0);
    if (!playlistData) return;

    return await this.getYoutubePlaylistDetailsById(playlistData.playlistId);
  }

  private async getYoutubePlaylistDetailsById(id: string): Promise<PlaylistDetails | undefined> {
    try {
      const foundPlaylist = await youtubeMusic.getYoutubePlaylistById(id);

      if (!foundPlaylist) return;

      const details: PlaylistDetails = {
        id: foundPlaylist.id || "",
        name: foundPlaylist.snippet?.title || "",
        count: foundPlaylist.contentDetails?.itemCount || 0,
        type: "yt"
      };

      return details;
    } catch (err) {
      musicLogger.error(`getYoutubePlaylistDetailsById -> ${err}`);
    }
  }

  private checkValidationOfUrlPlaylist(playlist: string) {
    if (isValidUrl(playlist)) {
      const playlistId = new URL(playlist).searchParams.get("list");
      if (playlistId) return playlistId;
      else {
        return;
      }
    }
  }

  public async loadYTPlaylist(playlistUrl: string) {
    const playlistId = this.checkValidationOfUrlPlaylist(playlistUrl);
    if (playlistId) await this.setCurrentPlaylistNameById(playlistId);
    else {
      await this.setCurrentPlaylistNameBySearch(playlistUrl);
    }

    await this.addVideosFromCurrentPlaylistIntoSongsList();
  }

  public async loadFromLocalFolder(folderName: string) {
    const loadedFolder = path.join(musicPath, folderName);
    if (!isADirectory(loadedFolder)) return;

    try {
      const songNamesToLoad = await localMusic.getSongsPropertiesFromFolder(folderName);

      this.playlistDetails = {
        id: folderName,
        count: songNamesToLoad.length,
        name: folderName,
        type: "local"
      };

      this.setSongs(songNamesToLoad);
    } catch (err) {}
  }

  public getPlaylistDetails() {
    return this.playlistDetails;
  }

  public setSongs(songs: SongProperties[]) {
    this.clear();
    songs.forEach((song) => this.enqueue(song));
  }
}
