import { BaseModelProperties } from "../api";
import { User } from "../users";

export interface SongCustomTitle {
  band: string;
  title: string;
}

export type SongLikesAction = -1 | 0 | 1;

export interface Song extends BaseModelProperties {
  title: string;
  youtubeId: string;
  customTitle?: SongCustomTitle;
  uses: number;
  usersUses: Record<string, number>;
  botUses: number;
  songRequestUses: number;
  duration: number;
  customId?: string;
  whoAdded: Pick<User, "_id" | "username" | "twitchName">;
  likes: Record<string, SongLikesAction>;
  enabled: boolean;
  lastUsed?: Date;
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
