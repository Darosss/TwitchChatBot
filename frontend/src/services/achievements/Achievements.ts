import useAxiosCustom, {
  PaginationData,
  ResponseData,
  ResponseMessage,
} from "../api";
import {
  Achievement,
  AchievementUpdateData,
  CustomAchievementCreateData,
  CustomAchievementUpdateData,
  AchievementUserProgress,
  Badge,
  GetBagesImagesResponseData,
  BadgeUpdateData,
  BadgeCreateData,
  AchievementStage,
  AchievementStageUpdateData,
  AchievementStageCreateData,
  AchievementsSearchParams,
} from "./types";

const BASE_URL = "/achievements";
const BASE_BADGES_URL = `${BASE_URL}/badges`;
const BASE_STAGES_URL = `${BASE_URL}/stages`;

export const useGetAchievements = (searchParams?: AchievementsSearchParams) => {
  const urlSearchParams =
    searchParams && new URLSearchParams(Object.entries(searchParams));
  return useAxiosCustom<PaginationData<Achievement>>({
    url: `${BASE_URL}/${urlSearchParams ? `?${urlSearchParams}` : ""}`,
    urlParams: !searchParams,
  });
};
export const useEditAchievement = (id: string, data: AchievementUpdateData) => {
  return useAxiosCustom<ResponseData<Achievement>, AchievementUpdateData>({
    url: `${BASE_URL}/${id}`,
    method: "PATCH",
    manual: true,
    urlParams: false,
    bodyData: data,
  });
};

export const useCreateCustomAchievement = (
  data: CustomAchievementCreateData
) => {
  return useAxiosCustom<ResponseData<Achievement>, CustomAchievementCreateData>(
    {
      url: `${BASE_URL}/custom/create`,
      method: "POST",
      bodyData: data,
      manual: true,
      urlParams: false,
    }
  );
};

export const useDeleteCustomAchievement = (id: string) => {
  return useAxiosCustom<ResponseMessage>({
    url: `${BASE_URL}/custom/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};

export const useUpdateCustomAchievement = (
  id: string,
  data: CustomAchievementUpdateData
) => {
  return useAxiosCustom<ResponseData<Achievement>, CustomAchievementUpdateData>(
    {
      url: `${BASE_URL}/custom/${id}`,
      method: "PATCH",
      bodyData: data,
      manual: true,
      urlParams: false,
    }
  );
};

/* PROGRESSES */
export const useGetUserAchievementsProgresses = (userId: string) => {
  return useAxiosCustom<ResponseData<AchievementUserProgress[]>>({
    url: `${BASE_URL}/user/${userId}`,
  });
};

/* BADGES */
export const useGetBadges = () => {
  return useAxiosCustom<PaginationData<Badge>>({
    url: `${BASE_BADGES_URL}/`,
  });
};

export const useGetBadgesImages = () => {
  return useAxiosCustom<ResponseData<GetBagesImagesResponseData>>({
    url: `${BASE_BADGES_URL}/available-images`,
  });
};

export const useGetBadgesIamgesBasePath = () => {
  return useAxiosCustom<ResponseData<string>>({
    url: `${BASE_BADGES_URL}/available-images/base-path`,
  });
};

export const useEditBadge = (id: string, data: BadgeUpdateData) => {
  return useAxiosCustom<ResponseData<Badge>, BadgeUpdateData>({
    url: `${BASE_BADGES_URL}/${id}`,
    method: "PATCH",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useCreateBadge = (data: BadgeCreateData) => {
  return useAxiosCustom<ResponseData<Badge>, BadgeCreateData>({
    url: `${BASE_BADGES_URL}/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useDeleteBadge = (id: string | null) => {
  return useAxiosCustom<ResponseMessage>({
    url: `${BASE_BADGES_URL}/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};

export const useDeleteBadgeImage = (badgeName: string | null) => {
  return useAxiosCustom<ResponseMessage>({
    url: `${BASE_BADGES_URL}/images/${badgeName}/delete`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};

/* STAGES */

export const useGetAchievementStages = (customParams?: string) => {
  return useAxiosCustom<PaginationData<AchievementStage>>({
    url: `${BASE_STAGES_URL}${customParams ? `?${customParams}` : ""}`,
    urlParams: customParams ? false : true,
  });
};

export const useDeleteAchievementStage = (id: string | null) => {
  return useAxiosCustom<ResponseMessage>({
    url: `${BASE_STAGES_URL}/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};

export const useGetAchievementStageById = (id: string) => {
  return useAxiosCustom<ResponseData<AchievementStage>>({
    url: `${BASE_STAGES_URL}/${id}`,
    method: "GET",
    urlParams: false,
  });
};

export const useEditAchievementStage = (
  id: string,
  data: AchievementStageUpdateData
) => {
  return useAxiosCustom<ResponseData<Badge>, AchievementStageUpdateData>({
    url: `${BASE_STAGES_URL}/${id}`,
    method: "PATCH",
    bodyData: data,
    manual: true,
  });
};

export const useGetAchievementStageSounds = () => {
  return useAxiosCustom<ResponseData<string[]>>({
    url: `${BASE_STAGES_URL}/available-sounds`,
    urlParams: false,
  });
};

export const useGetAchievementStageSoundsBasePath = () => {
  return useAxiosCustom<ResponseData<string>>({
    url: `${BASE_STAGES_URL}/available-sounds/base-path`,
  });
};

export const useDeleteAchievementStageSound = (soundName: string | null) => {
  return useAxiosCustom<ResponseMessage>({
    url: `${BASE_STAGES_URL}/sounds/${soundName}/delete`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};

export const useCreateAchievementStage = (data: AchievementStageCreateData) => {
  return useAxiosCustom<
    ResponseData<AchievementStage>,
    AchievementStageCreateData
  >({
    url: `${BASE_STAGES_URL}/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};
