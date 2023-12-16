import useAxiosCustom, { PaginationData } from "../api";
import { Song, SongUpdateData, SongCreateData } from "./types";

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

export const useDeleteSong = (songId: string | null) => {
  return useAxiosCustom<Song>({
    url: `/songs/delete/${songId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
