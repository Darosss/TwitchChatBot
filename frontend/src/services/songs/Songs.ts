import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  BaseEndpointNames,
  customAxios,
  onErrorHelperService,
  OnErrorHelperServiceAction,
  OnErrorHelperServiceConcern,
  PromiseBackendData,
  PromisePaginationData,
  QueryParams,
  refetchDataFunctionHelper,
} from "../api";
import {
  Song,
  SongUpdateData,
  SongCreateData,
  FetchSongsParams,
} from "./types";

export const fetchSongsDefaultParams: Required<FetchSongsParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  customId: "",
  sortOrder: "asc",
  sortBy: "lastUsed",
  end_date: "",
  start_date: "",
};

const baseEndpointName = BaseEndpointNames.SONGS;
export const queryKeysSongs = {
  allSongs: "songs",
};

export const fetchSongs = async (
  params?: QueryParams<keyof FetchSongsParams>
): PromisePaginationData<Song> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const createSong = async (
  newSong: SongCreateData
): PromiseBackendData<Song> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newSong
  );
  return response.data;
};

export const editSong = async ({
  id,
  updatedSong,
}: {
  id: string;
  updatedSong: SongUpdateData;
}): PromiseBackendData<Song> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedSong
  );
  return response.data;
};

export const deleteSong = async (id: string): PromiseBackendData<Song> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetSongs = (params?: QueryParams<keyof FetchSongsParams>) => {
  return useQuery([queryKeysSongs.allSongs, params], () => fetchSongs(params));
};

export const useCreateSong = () => {
  const refetchSongs = useRefetchSongsData();
  return useMutation(createSong, {
    onSuccess: refetchSongs,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.SONG,
        OnErrorHelperServiceAction.CREATE
      );
    },
  });
};

export const useEditSong = () => {
  const refetchSongs = useRefetchSongsData();
  return useMutation(editSong, {
    onSuccess: refetchSongs,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.SONG,
        OnErrorHelperServiceAction.EDIT
      );
    },
  });
};

export const useDeleteSong = () => {
  const refetchSongs = useRefetchSongsData();
  return useMutation(deleteSong, {
    onSuccess: refetchSongs,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.SONG,
        OnErrorHelperServiceAction.DELETE
      );
    },
  });
};

export const useRefetchSongsData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysSongs,
    "allSongs",
    queryClient,
    null,
    exact
  );
};
