import useAxiosCustom, { PaginationData, ResponseData } from "./ApiService";
import { Tag } from "./TagService";

export interface Badge {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BadgeCreateData = Pick<Badge, "name" | "imageUrl" | "description">;
export type BadgeUpdateData = Partial<BadgeCreateData>;

export type StageDataRarity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export interface AchievementStageData<T = Badge> {
  name: string;
  stage: number;
  goal: number;
  badge: T;
  sound?: string;
  rarity?: StageDataRarity;
  showTimeMs: number;
}

export interface AchievementStage<T = Badge> {
  _id: string;
  name: string;
  stageData: AchievementStageData<T>[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AchievementStageCreateData
  extends Pick<AchievementStage, "name"> {
  stageData: AchievementStageData<string>[];
}
export type AchievementStageUpdateData = Partial<AchievementStageCreateData>;

export interface Achievement {
  _id: string;
  name: string;
  description: string;
  stages: AchievementStage;
  isTime: boolean;
  tag: Tag;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AchievementUserProgress {
  _id: string;
  userId: string;
  achievement: Achievement;
  value: number;
  progresses: [number, number][];
  createdAt: Date;
  updatedAt: Date;
}

const BASE_URL = "/achievements";
const BASE_BADGES_URL = `${BASE_URL}/badges`;
const BASE_STAGES_URL = `${BASE_URL}/stages`;

export const useGetAchievements = () => {
  return useAxiosCustom<PaginationData<Achievement>>({
    url: `${BASE_URL}/`,
  });
};

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
  return useAxiosCustom<ResponseData<string[]>>({
    url: `${BASE_BADGES_URL}/available-images`,
  });
};

export const useGetBadgesIamgesBasePath = () => {
  return useAxiosCustom<ResponseData<string>>({
    url: `${BASE_BADGES_URL}/available-images/base-path`,
  });
};

export const useEditBadge = (id: string, data: BadgeUpdateData) => {
  return useAxiosCustom<Badge>({
    url: `${BASE_BADGES_URL}/${id}`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useCreateBadge = (data: BadgeCreateData) => {
  return useAxiosCustom<Badge>({
    url: `${BASE_BADGES_URL}/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useDeleteBadge = (id: string) => {
  return useAxiosCustom({
    url: `${BASE_BADGES_URL}/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};

export const useDeleteBadgeImage = (badgeName: string) => {
  return useAxiosCustom<{ message: string }>({
    url: `${BASE_BADGES_URL}/images/${badgeName}/delete`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};

/* STAGES */

export const useGetAchievementStages = () => {
  return useAxiosCustom<PaginationData<AchievementStage>>({
    url: `${BASE_STAGES_URL}/`,
  });
};

export const useDeleteAchievementStage = (id: string) => {
  return useAxiosCustom({
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
  return useAxiosCustom<Badge>({
    url: `${BASE_STAGES_URL}/${id}`,
    method: "POST",
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

export const useDeleteAchievementStageSound = (soundName: string) => {
  return useAxiosCustom<{ message: string }>({
    url: `${BASE_STAGES_URL}/sounds/${soundName}/delete`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};

export const useCreateAchievementStage = (data: AchievementStageCreateData) => {
  return useAxiosCustom<Badge>({
    url: `${BASE_STAGES_URL}/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};
