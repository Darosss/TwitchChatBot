import { SongProperties, SongType } from "@socket";
import youtubeMusic from "./YoutubeMusic";
import { MusicType } from "./enums";
import { ConfigModel, SongsModel } from "@models";
import { ConfigManager } from "../ConfigManager";
import { CommonSongHandlersReturnData, RequestSongByUserCommonParams, RequestSongReturnType } from "./types";
import { QueueHandler } from "../QueueHandler";
import { getOneSong, updateSongUsesById } from "@services";
import fs from "fs";
import { publicEndpointPath } from "@configs";
import path from "path";
import ytdl from "@distube/ytdl-core";
import { musicLogger } from "@utils";

export type SongRequestListType = [string, SongProperties] | null;

type IsEnoughRequestInfoOpts = {
  minLength: number;
};
type IsEnoughRequestInfoReturn = { success: boolean; error: null | string };

class SongRequest extends QueueHandler<SongRequestListType> {
  private configs: ConfigModel = ConfigManager.getInstance().getConfig();
  private maxSongDuration = 60 * 10; // 10min; TODO: add to configs
  private readonly songRequestInfoOpts: IsEnoughRequestInfoOpts = {
    minLength: 3
  };
  constructor() {
    super();

    ConfigManager.getInstance().registerObserver(this.handleConfigUpdate.bind(this));
  }
  public peekNonNull(): SongRequestListType | undefined {
    return this.getItems().find((item) => item !== null);
  }

  public getDurationTillFindRequesterSong(requester: string) {
    let totalDuration = 0;
    this.getItems().every((songData) => {
      if (!songData) return true;
      else if (songData[0] !== requester) {
        totalDuration += songData[1].duration;
        return true;
      }
    });

    return totalDuration;
  }

  public getNonNullLength(): number {
    return this.getItems().filter((item) => item !== null).length;
  }

  public override dequeue(): SongRequestListType | undefined {
    const foundIndex = this.getItems().findIndex((item) => item !== null);

    const item = foundIndex !== -1 ? this.getItems().splice(foundIndex, 1).at(0) : undefined;
    if (this.getLength() === 0) this.clear();
    return item;
  }

  public getRequestByUserName(username: string) {
    return this.getItems().filter((item) => item?.[0] === username);
  }

  public async requestSongByUser(
    data: RequestSongByUserCommonParams,
    callback: (error: string | null, params: RequestSongByUserCommonParams) => Promise<string>
  ) {
    const { username, songName } = data;
    let error: null | string = null;
    if (!this.configs.musicConfigs.songRequest) {
      musicLogger.info(`@${username}, song request is turned off.`);
      error = `@${username}, song request is turned off.`;
    } else if (this.doesUserHaveAvailableRequest(username, this.configs.musicConfigs.maxSongRequestByUser)) {
      musicLogger.info(`You already song requested maximum songs: ${this.configs.musicConfigs.maxSongRequestByUser})`);
      error = `You already song requested maximum songs: (${this.configs.musicConfigs.maxSongRequestByUser})`;
    }
    const enoughInfoData = this.isEnoughRequestSongInfo(songName, username, this.songRequestInfoOpts);
    if (enoughInfoData.error || !enoughInfoData.success) error = enoughInfoData.error || "Not enough song info";

    return await callback(error, data);
  }

  private async handleConfigUpdate(newConfigs: ConfigModel) {
    this.configs = newConfigs;
  }

  public removeFromRequestedQue(username: string, songId: string) {
    const index = this.getItems().findIndex((item) => item?.[0] === username && item?.[1].id === songId);

    if (index !== -1) this.getItems().splice(index, 1);
  }
  public checkIfUserHasAnySongInRequest(user: string) {
    const atLeastOne = this.getItems().some((item) => item?.[0] === user);
    return atLeastOne;
  }

  public doesUserHaveAvailableRequest(username: string, maxUserSongs: number) {
    if (this.haveUserMoreSongsThanRequestLimit(username, maxUserSongs)) {
      return true;
    }
  }

  private haveUserMoreSongsThanRequestLimit(username: string, maxUserSongs: number) {
    const count = this.getItems().filter((item) => item?.[0] === username).length;

    return count >= maxUserSongs;
  }

  private isEnoughRequestSongInfo(
    songName: string,
    username: string,
    opts: IsEnoughRequestInfoOpts
  ): IsEnoughRequestInfoReturn {
    if (songName.length < opts.minLength) {
      const error = `@${username}, you need to provide at least ${opts.minLength} length name`;
      musicLogger.error(error);
      return { success: false, error };
    }

    return { success: true, error: null };
  }

  private extractSongPropertiesFromModelHelper(song: SongsModel): SongProperties {
    const { duration, youtubeId, _id, title, downloadedData } = song;
    const { folderName, fileName, publicPath } = downloadedData || {};
    const type: SongType = youtubeId ? "yt" : "local";
    return {
      duration,
      name: title,
      id: youtubeId || _id,
      type,
      downloadedData:
        folderName && fileName && publicPath
          ? {
              folderName,
              fileName,
              publicPath
            }
          : undefined
    };
  }

  private async _getOneSongHelper(songName: string): Promise<SongsModel | undefined | null> {
    const escapedSearch = songName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const titleRegex = new RegExp(escapedSearch, "i");
    return await getOneSong({
      $or: [{ youtubeId: songName }, { title: { $regex: titleRegex } }]
    });
  }

  private async _handleOnDbSongButNotDownloaded(foundSong: SongsModel): Promise<CommonSongHandlersReturnData> {
    if (foundSong.youtubeId) {
      const ytSongData = await youtubeMusic.downloadSongAndUpdateDBData({
        id: foundSong.youtubeId,
        name: foundSong.title,
        type: "yt",
        duration: foundSong.duration
      });
      return ytSongData;
    } else return { error: "The file you tried to play should be, but it's not. Try different songs" };
  }

  private async _handleOnNoDbSongYT(songName: string): Promise<CommonSongHandlersReturnData> {
    const isYtId = ytdl.validateID(songName);
    const data = await youtubeMusic.handleYoutubeSongLogic(
      isYtId ? { youtubeId: songName } : { searchQuery: songName }
    );
    data;
    return data;
  }

  private async _handleRequestSongConditions(
    songName: string,
    foundSong?: SongsModel
  ): Promise<CommonSongHandlersReturnData> {
    const foundSongButFileNotFound =
      (foundSong && !foundSong.downloadedData?.publicPath) ||
      (foundSong &&
        foundSong.downloadedData?.publicPath &&
        !fs.existsSync(path.join(publicEndpointPath, foundSong.downloadedData.publicPath)));

    if (foundSongButFileNotFound) {
      musicLogger.info(`Requested from ${MusicType.DB_DOWNLOAD}`); //TODO: <-- Remove later
      return await this._handleOnDbSongButNotDownloaded(foundSong!);
      // If file is in DB, but its not downloaded
    }
    // else if(notFoundSongButSunoId) {
    // TODO: add suno handling
    // }
    else if (!foundSong) {
      musicLogger.info(`Requested from ${MusicType.YT}`); //TODO: <-- Remove later
      return await this._handleOnNoDbSongYT(songName);
    } else {
      musicLogger.info(`Requested from ${MusicType.DB}`); //TODO: <-- Remove later
      return foundSong;
    }
  }

  public async requestSong(username: string, songName: string): Promise<RequestSongReturnType> {
    let songProperties: SongProperties | null = null;
    let error: string | null = null;

    const foundSong = (await this._getOneSongHelper(songName)) || undefined;
    const data = await this._handleRequestSongConditions(songName, foundSong);
    if ("error" in data) error = data.error;
    else {
      songProperties = this.extractSongPropertiesFromModelHelper(data);
      await updateSongUsesById(data._id, "songRequestUses");
    }

    const added = songProperties ? await this.addRequestedSongToList(username, songProperties) : false;

    if (!error && !added) {
      error = `${username ? `@${username}` : ""} couldn't find any similar songs`;
    } else {
    }

    return { error: error, songData: !error && songProperties ? [username, songProperties] : null };
  }

  private findValidNullSlot(username: string): number {
    for (let i = 0; i < this.getItems().length; i++) {
      if (this.getItems()[i] === null) {
        const prevEntry = this.getItems()[i - 1];
        const nextEntry = this.getItems()[i + 1];
        const prevIsSameUser = prevEntry && prevEntry[0] === username;
        const nextIsSameUser = nextEntry && nextEntry[0] === username;

        if (!prevIsSameUser && !nextIsSameUser) {
          return i;
        }
      }
    }
    return -1;
  }

  private async addRequestedSongToList(username: string, song: SongProperties) {
    const indexToInsert = this.findValidNullSlot(username);
    if (indexToInsert !== -1) {
      this.getItems()[indexToInsert] = [username, song];
    } else {
      this.getItems().push([username, song]);
      this.getItems().push(null);
    }
    if (indexToInsert === this.getItems().length - 1) this.getItems().push(null);

    return true;
  }
}

export { SongRequest };
