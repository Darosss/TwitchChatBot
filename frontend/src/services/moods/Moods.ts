import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  BaseEndpointNames,
  QueryParams,
  PromisePaginationData,
  customAxios,
  PromiseBackendData,
  onErrorHelperService,
  OnErrorHelperServiceAction,
  OnErrorHelperServiceConcern,
  refetchDataFunctionHelper,
} from "../api";
import { FetchMoodParams, Mood, MoodCreateData, MoodUpdateData } from "./types";
import { socketConn } from "@socket";

export const fetchMoodsDefaultParams: Required<FetchMoodParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "asc",
  sortBy: "createdAt",
};

const baseEndpointName = BaseEndpointNames.MOODS;
export const queryKeysMoods = {
  allMoods: "moods",
};

export const fetchMoods = async (
  params?: QueryParams<keyof FetchMoodParams>
): PromisePaginationData<Mood> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const createMood = async (
  newMood: MoodCreateData
): PromiseBackendData<Mood> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newMood
  );
  return response.data;
};

export const editMood = async ({
  id,
  updatedMood,
}: {
  id: string;
  updatedMood: MoodUpdateData;
}): PromiseBackendData<Mood> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedMood
  );
  return response.data;
};

export const deleteMood = async (id: string): PromiseBackendData<Mood> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetMoods = (params?: QueryParams<keyof FetchMoodParams>) => {
  return useQuery([queryKeysMoods.allMoods, params], () => fetchMoods(params));
};

export const useEditMood = () => {
  const refetchMoods = useRefetchMoodsData();
  return useMutation(editMood, {
    onSuccess: () => {
      refetchMoods().then(() => {
        socketConn.emit("changeModes");
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.MOOD,
        OnErrorHelperServiceAction.EDIT
      );
    },
  });
};

export const useCreateMood = () => {
  const refetchMoods = useRefetchMoodsData();
  return useMutation(createMood, {
    onSuccess: () => {
      refetchMoods().then(() => {
        socketConn.emit("changeModes");
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.MOOD,
        OnErrorHelperServiceAction.CREATE
      );
    },
  });
};

export const useDeleteMood = () => {
  const refetchMoods = useRefetchMoodsData();
  return useMutation(deleteMood, {
    onSuccess: () => {
      refetchMoods().then(() => {
        socketConn.emit("changeModes");
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.MOOD,
        OnErrorHelperServiceAction.DELETE
      );
    },
  });
};

export const useRefetchMoodsData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysMoods,
    "allMoods",
    queryClient,
    null,
    exact
  );
};
