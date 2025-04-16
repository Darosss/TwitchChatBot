import { SortQuery, SelectQuery } from "@services";
import {
  AchievementModel,
  AchievementStageModel,
  AchievementUserProgressModel,
  AchievementWithBadgePopulated
} from "@models";
import {
  ObtainAchievementBaseData,
  ObtainAchievementDataWithCollectedAchievement,
  ObtainAchievementDataWithProgressOnly
} from "@socket";

export interface AchievementsFindOptions<T = AchievementModel> {
  select?: SelectQuery<T>;
}

export interface ManyAchievementsFindOptions<T = AchievementModel> extends AchievementsFindOptions<T> {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type AchievementUpdateData = Partial<
  Omit<AchievementModel, "_id" | "createdAt" | "updatedAt" | "stages" | "tag">
> & { stages?: string; tag?: string };

export interface AchievementCreateData
  extends Pick<AchievementModel, "name" | "description" | "hidden">,
    Partial<Pick<AchievementModel, "enabled" | "showProgress" | "isTime">> {
  stages: string;
  tag: string;
}
export type AchievementUpdateDataController = Pick<
  AchievementUpdateData,
  "description" | "enabled" | "tag" | "stages" | "hidden"
>;

export type CustomAchievementCreateData = AchievementCreateData & Required<Pick<AchievementUpdateData, "custom">>;
export type CustomAchievementUpdateData = Partial<CustomAchievementCreateData>;
export type AchievementUserProgressUpdate = Partial<Pick<AchievementUserProgressModel, "progresses" | "value">>;

//TODO: refactor this into ManyAchievementsFindOptions, create separate find options for stages, badges, progresses
export interface AchievementsPopulateOptions {
  stages?: boolean;
  stagesBadge?: boolean;
  tag?: boolean;
}

export interface AchievementStagesPopulateOptions {
  stageDataBadge?: boolean;
}

export interface AchievementUserProgressCreate
  extends Pick<AchievementUserProgressModel, "achievement" | "userId">,
    AchievementUserProgressUpdate {}

export type AchievementStageCreateData = Pick<AchievementStageModel, "name" | "stageData">;
export type AchievementStageUpdateData = Partial<AchievementStageCreateData>;

export type GainedProgress = {
  currentStageNumber: number | null;
  nextStageNumber: number | null;
  progress: number;
};

export type UpdateAchievementUserProgressProgressesReturnData = {
  foundAchievement: AchievementWithBadgePopulated;
  nowFinishedStages: AchievementUserProgressModel["progresses"];
  gainedProgress: GainedProgress | null;
};

export interface UpdateFinishedStagesDependsOnProgressReturnData {
  nowFinishedStages: AchievementUserProgressModel["progresses"];
  gainedProgress: GainedProgress | null;
}

export interface GetDataForObtainAchievementEmitReturnData {
  achievement: ObtainAchievementBaseData["achievement"];
  stages: ObtainAchievementDataWithCollectedAchievement["stage"][];
  gainedProgress: ObtainAchievementDataWithProgressOnly["progressData"] | null;
}

export interface UpdateAchievementUserProgressProgressesArgs {
  achievementName: string;
  userId: string;
  progress: { increment?: boolean; value: number };
}

export interface AchievementUserProgressesPopulateOptions {
  achievements?: {
    value: boolean;
    stages?: {
      value: boolean;
      badges?: boolean;
    };
  };
}
export interface AchievementUserProgressesFindOptions {
  select?: SelectQuery<AchievementUserProgressModel>;
  populate?: AchievementUserProgressesPopulateOptions;
}
