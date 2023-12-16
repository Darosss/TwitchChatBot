import useAxiosCustom, { PaginationData, ResponseData } from "../api";
import { Song, SongUpdateData, SongCreateData } from "./types";

export const useGetSongs = () => {
  return useAxiosCustom<PaginationData<Song>>({
    url: `/songs`,
  });
};

export const useEditSong = (commandId: string, data: SongUpdateData) => {
  return useAxiosCustom<ResponseData<Song>, SongUpdateData>({
    url: `/songs/${commandId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const useCreateSong = (data: SongCreateData) => {
  return useAxiosCustom<ResponseData<Song>, SongCreateData>({
    url: `/songs/create`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useDeleteSong = (songId: string | null) => {
  return useAxiosCustom<ResponseData<Song>>({
    url: `/songs/delete/${songId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
