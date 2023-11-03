import useAxiosCustom, { PaginationData, ResponseData } from "./ApiService";

export interface Badge {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AchievementStageData {
  name: string;
  stage: number;
  goal: number;
  badge: Badge;
}

export interface AchievementStage {
  name: string;
  stageData: AchievementStageData[];
}

export interface Achievement {
  _id: string;
  name: string;
  description: string;
  stages: AchievementStage;
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

export const useGetAchievements = () => {
  return useAxiosCustom<PaginationData<Achievement>>({
    url: `/achievements`,
  });
};

export const useGetUserAchievementsProgresses = (userId: string) => {
  return useAxiosCustom<ResponseData<AchievementUserProgress[]>>({
    url: `/achievements/user/${userId}`,
  });
};
