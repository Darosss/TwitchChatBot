import { BaseModelProperties, DefaultRequestParams } from "../api";
import { User } from "../users";

export interface SongCustomTitle {
  band: string;
  title: string;
}

export type SongLikesAction = -1 | 0 | 1;

export interface DownloadedData {
  fileName: string;
  folderName: string;
  publicPath: string;
}
export interface Song extends BaseModelProperties {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  youtubeId?: string;
  sunoId?: string;
  localSong?: boolean;
  downloadedData?: DownloadedData;
  duration: number;
  customTitle?: SongCustomTitle;
  customId?: string;
  uses: number;
  usersUses: Record<string, number>;
  botUses: number;
  songRequestUses: number;
  whoAdded: User;
  likes: Record<string, SongLikesAction>;
  enabled: boolean;
  lastUsed?: Date;
  tags: string;
}

export interface SongCreateData
  extends Omit<
    Song,
    | "_id"
    | "createdAt"
    | "updatedAt"
    | "uses"
    | "usersUses"
    | "botUses"
    | "songRequestUses"
    | "whoAdded"
    | "likes"
  > {
  whoAdded: string;
}

export interface SongUpdateData
  extends Partial<SongCreateData>,
    Partial<Pick<Song, "enabled">> {}

export interface FetchSongsParams extends DefaultRequestParams<keyof Song> {
  customId?: string;
  start_date?: string;
  end_date?: string;
}
