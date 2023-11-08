import { SortQuery, SelectQuery } from "@services";
import {
  AchievementModel,
  AchievementStageModel,
  AchievementUserProgressModel,
  AchievementWithBadgePopulated
} from "@models";
import { ObtainAchievementData } from "@socket";

export interface AchievementsFindOptions<T = AchievementModel> {
  select?: SelectQuery<T>;
}

export interface ManyAchievementsFindOptions<T = AchievementModel> extends AchievementsFindOptions<T> {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type AchievementUpdateData = Partial<Omit<AchievementModel, "_id" | "createdAt" | "updatedAt">>;

export type AchievementCreateData = Omit<AchievementUpdateData, "name" | "stages" | "tag"> &
  Pick<AchievementModel, "name"> & { stages: string; tag: string };

export type AchievementUserProgressUpdate = Partial<Pick<AchievementUserProgressModel, "progresses" | "value">>;

export interface AchievementUserProgressCreate
  extends Pick<AchievementUserProgressModel, "achievement" | "userId">,
    AchievementUserProgressUpdate {}

export type AchievementStageCreateData = Pick<AchievementStageModel, "name" | "stageData">;
export type AchievementStageUpdateData = Partial<AchievementStageCreateData>;

export type UpdateAchievementUserProgressProgressesReturnData = {
  foundAchievement: AchievementWithBadgePopulated;
  nowFinishedStages: AchievementUserProgressModel["progresses"];
};

export interface GetDataForObtainAchievementEmitReturnData {
  achievementName: string;
  stages: ObtainAchievementData["stage"][];
}

export interface UpdateAchievementUserProgressProgressesArgs {
  achievementName: string;
  userId: string;
  progress: { increment?: boolean; value: number };
}
