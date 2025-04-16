import { BaseModelProperties, DefaultRequestParams } from "../api";
import { Tag } from "../tags";
import { CustomAchievementAction } from "./enums";

export interface BadgeModelImagesUrls {
  x32: string;
  x64: string;
  x96: string;
  x128: string;
}
export interface Badge extends BaseModelProperties {
  name: string;
  description: string;
  imagesUrls: BadgeModelImagesUrls;
}

export type BadgeCreateData = Pick<
  Badge,
  "name" | "imagesUrls" | "description"
>;
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

export interface AchievementStage<T = Badge> extends BaseModelProperties {
  name: string;
  stageData: AchievementStageData<T>[];
}

export interface AchievementStageCreateData
  extends Pick<AchievementStage, "name"> {
  stageData: AchievementStageData<string>[];
}
export type AchievementStageUpdateData = Partial<AchievementStageCreateData>;

export interface AchievementCustomField {
  stringValues?: string[];
  numberValue?: number;
  caseSensitive?: boolean;
  action: CustomAchievementAction;
}

export interface Achievement extends BaseModelProperties {
  name: string;
  description: string;
  stages: AchievementStage;
  isTime: boolean;
  tag: Tag;
  enabled: boolean;
  custom?: AchievementCustomField;
  hidden?: boolean;
}
export interface AchievementUpdateData
  extends Pick<Achievement, "description" | "enabled" | "hidden"> {
  stages: string;
  tag: string;
}

export interface CustomAchievementCreateData
  extends Required<
      Pick<Achievement, "description" | "name" | "enabled" | "custom">
    >,
    Pick<Achievement, "hidden"> {
  stages: string;
  tag: string;
}

export interface CustomAchievementUpdateData
  extends Partial<CustomAchievementCreateData> {}

export interface AchievementUserProgress extends BaseModelProperties {
  userId: string;
  achievement: Achievement;
  value: number;
  progresses: [number, number][];
}

export interface GetBagesImagesResponseData {
  imagesPaths: [string, string][];
  separatorSizes: string;
  availableSizes: number[];
}

export interface FetchAchievementsParams
  extends DefaultRequestParams<keyof Achievement> {
  search_name?: string;
  custom_action: string;
}

export interface FetchBadgesParams extends DefaultRequestParams<keyof Badge> {
  search_name?: string;
  imagesUrls?: string;
}

export interface FetchStagesParams
  extends DefaultRequestParams<keyof AchievementStage> {
  search_name?: string;
  stageName?: string;
  sound?: string;
}
