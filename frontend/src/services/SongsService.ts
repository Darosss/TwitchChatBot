import useAxiosCustom, { PaginationData } from "./ApiService";
import { User } from "./UserService";

export interface SongCustomTitle {
  band: string;
  title: string;
}

export type SongLikesAction = -1 | 0 | 1;

export interface Song {
  _id: string;
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
  createdAt: Date;
  updatedAt: Date;
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

interface SongUpdateData
  extends Partial<SongCreateData>,
    Partial<Pick<Song, "enabled">> {}

export const useGetSongs = () => {
  return useAxiosCustom<PaginationData<Song>>({
    url: `/songs`,
  });
};

export const useEditSong = (commandId: string, data: SongUpdateData) => {
  return useAxiosCustom<SongUpdateData>({
    url: `/songs/${commandId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const useCreateSong = (data: SongCreateData) => {
  return useAxiosCustom<SongCreateData>({
    url: `/songs/create`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useDeleteSong = (songId: string) => {
  return useAxiosCustom<Song>({
    url: `/songs/delete/${songId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
