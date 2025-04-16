import { useMutation, useQuery, useQueryClient } from "react-query";
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
  AchievementStage,
  AchievementStageCreateData,
  AchievementStageUpdateData,
  FetchStagesParams,
} from "./types";

const baseEndpointName = `${BaseEndpointNames.ACHIEVEMENTS}/${BaseEndpointNames.STAGES}`;

export const fetchAchievementStagesDefaultParams: Required<FetchStagesParams> =
  {
    limit: 10,
    page: 1,
    search_name: "",
    sortOrder: "asc",
    sortBy: "createdAt",
    stageName: "",
    sound: "",
  };

export const queryKeysStages = {
  allAchievementStages: "achievement-stages",
  achievementStagesById: (id: string) =>
    ["achievement-stages", id] as [string, string],
  achievementStageSounds: "achievement-stages-sounds",
  achievementStageSoundsBasePath: "achievement-stages-sounds-base-path",
};

export const fetchAchievementStages = async (
  params?: QueryParams<keyof FetchStagesParams>
): PromisePaginationData<AchievementStage> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const deleteAchievementStage = async (
  id: string
): PromiseBackendData<AchievementStage> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};
export const editAchievementStage = async ({
  id,
  updatedAchievementStage,
}: {
  id: string;
  updatedAchievementStage: AchievementStageUpdateData;
}): PromiseBackendData<AchievementStage> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedAchievementStage
  );
  return response.data;
};

export const createaAchievementStage = async (
  data: AchievementStageCreateData
): PromiseBackendData<AchievementStage> => {
  const response = await customAxios.post(`/${baseEndpointName}/create`, data);
  return response.data;
};

export const getAchievementStageById = async (
  id: string
): PromiseBackendData<AchievementStage> => {
  const response = await customAxios.get(`/${baseEndpointName}/${id}`);
  return response.data;
};

export const fetchAchievementStageSounds =
  async (): PromisePaginationData<string> => {
    const response = await customAxios.get(
      `${baseEndpointName}/available-sounds`
    );
    return response.data;
  };

export const fetchAchievementStageSoundsBasePath =
  async (): PromiseBackendData<string> => {
    const response = await customAxios.get(
      `${baseEndpointName}/available-sounds/base-path`
    );
    return response.data;
  };

export const deleteAchievementStageSound = async (
  soundName: string
): PromiseBackendData<boolean> => {
  const response = await customAxios.delete(
    `${baseEndpointName}/sounds/${soundName}/delete`
  );
  return response.data;
};

export const useGetAchievementStages = (
  params?: QueryParams<keyof FetchStagesParams>
) => {
  return useQuery([queryKeysStages.allAchievementStages, params], () =>
    fetchAchievementStages(params)
  );
};

export const useDeleteAchievementStage = () => {
  const refetchAchievementStages = useRefetchAchievementStagesData();
  return useMutation(deleteAchievementStage, {
    onSuccess: refetchAchievementStages,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.ACHIEVEMENT_STAGE,
        OnErrorHelperServiceAction.DELETE
      );
    },
  });
};

export const useGetAchievementStageById = (id: string) => {
  return useQuery(queryKeysStages.achievementStagesById(id), () =>
    getAchievementStageById(id)
  );
};

export const useCreateAchievementStage = () => {
  const refetchAchievementStages = useRefetchAchievementStagesData();
  return useMutation(createaAchievementStage, {
    onSuccess: refetchAchievementStages,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.ACHIEVEMENT_STAGE,
        OnErrorHelperServiceAction.CREATE
      );
    },
  });
};

export const useEditAchievementStage = () => {
  const refetchAchievementStages = useRefetchAchievementStagesData();
  return useMutation(editAchievementStage, {
    onSuccess: refetchAchievementStages,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.ACHIEVEMENT_STAGE,
        OnErrorHelperServiceAction.EDIT
      );
    },
  });
};

export const useGetAchievementStagesSounds = () => {
  return useQuery(
    queryKeysStages.achievementStageSounds,
    fetchAchievementStageSounds
  );
};

export const useGetAchievementStagesSoundsBasePath = () => {
  return useQuery(
    queryKeysStages.achievementStageSoundsBasePath,
    fetchAchievementStageSoundsBasePath
  );
};

export const useDeleteAchievementStageSound = () => {
  const refetchAchievementStageSounds = useRefetchAchievementStageSoundsData();
  return useMutation(deleteAchievementStageSound, {
    onSuccess: refetchAchievementStageSounds,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.ACHIEVEMENT_STAGE_SOUND,
        OnErrorHelperServiceAction.DELETE
      );
    },
  });
};

//TODO: make from these one function somehow later
export const useRefetchAchievementStagesData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysStages,
    "allAchievementStages",
    queryClient,
    null,
    exact
  );
};

export const useRefetchAchievementStageSoundsData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysStages,
    "achievementStageSounds",
    queryClient,
    null,
    exact
  );
};

export const useRefetchAchievementStageById = (exact = false) => {
  const queryClient = useQueryClient();
  return (id: string) =>
    refetchDataFunctionHelper(
      queryKeysStages,
      "achievementStagesById",
      queryClient,
      [id],
      exact
    );
};
