import { SortQuery, SelectQuery } from "@services";
import { AchievementModel, AchievementStageModel, AchievementUserProgressModel } from "@models";

export interface AchievementsFindOptions<T = AchievementModel> {
  select?: SelectQuery<T>;
}

export interface ManyAchievementsFindOptions<T = AchievementModel> extends AchievementsFindOptions<T> {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type AchievementUpdateData = Partial<Omit<AchievementModel, "_id" | "createdAt" | "updatedAt">>;

export type AchievementCreateData = Omit<AchievementUpdateData, "name" | "stages"> &
  Pick<AchievementModel, "name"> & { stages: string };

export type AchievementUserProgressUpdate = Partial<Pick<AchievementUserProgressModel, "progresses" | "value">>;

export interface AchievementUserProgressCreate
  extends Pick<AchievementUserProgressModel, "achievement" | "userId">,
    AchievementUserProgressUpdate {}

export type AchievementStageCreateData = Pick<AchievementStageModel, "name" | "stageData">;
export type AchievementStageUpdateData = Partial<AchievementStageCreateData>;
