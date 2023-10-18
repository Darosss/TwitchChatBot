import { SongsModel } from "@models";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";

export interface SongsFindOptions {
  select?: SelectQuery<SongsModel>;
  populate?: PopulateSelect;
}

export interface ManySongsFindOptions extends SongsFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type SongsOptionalData = Partial<Omit<SongsModel, "_id" | "createdAt" | "updatedAt">>;

export interface SongsCreateData
  extends Pick<SongsModel, "title" | "duration" | "whoAdded" | "youtubeId">,
    Omit<SongsOptionalData, "title" | "duration" | "whoAdded" | "youtubeId"> {}

export interface SongsUpdateData extends SongsOptionalData, Partial<SongsCreateData> {}

export type ManageSongLikesAction = "like" | "dislike" | "nothing";
