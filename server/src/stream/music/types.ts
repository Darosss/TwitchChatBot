import { SongsModel } from "@models";
import { AudioStreamData, SongProperties } from "@socket";
import { youtube_v3 } from "googleapis";

export type ItemMusicQueue = Omit<AudioStreamData, "downloadedData"> & Pick<SongProperties, "downloadedData">;

export type CommonReturnData = {
  message: string;
  fileData?: Required<SongProperties> & { tags?: string };
};

export type RequestSongByUserCommonParams = {
  username: string;
  songName: string;
};

export type RequestSongReturnType = {
  error: string | null;
  songData: [string, SongProperties] | null;
};

export type CommonSongHandlersReturnData =
  | {
      error: string;
    }
  | SongsModel;

export type YoutubeSongProperties = SongProperties & {
  ageRestricted?: string | null;
  topicDetails?: youtube_v3.Schema$VideoTopicDetails | undefined;
  isPrivate?: boolean;
};
