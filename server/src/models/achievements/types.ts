import { Document } from "mongoose";
import { BaseModel } from "../types";
import { BadgeModel } from "../badges";
import { UserModel } from "../users";
import { TagModel } from "../tags";
import { CustomAchievementAction } from "./enums";

export type StageDataRarity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export interface StageData<T = string> {
  name: string;
  stage: number;
  goal: number;
  badge: T;
  showTimeMs: number;
  sound?: string;
  rarity?: StageDataRarity;
}
export type StageDataWithBadgePopulated = StageData<BadgeModel>;
export interface AchievementStageModel<T = string> extends BaseModel {
  name: string;
  stageData: StageData<T>[];
}

export type AchievementStageDocument = AchievementStageModel & Document;

export interface AchievementCustomModel {
  stringValues?: string[];
  caseSensitive?: boolean;
  numberValue?: number;
  action: CustomAchievementAction;
}

export interface AchievementModel<T = string | BadgeModel> extends BaseModel {
  name: string;
  description: string;
  stages: AchievementStageModel<T>;
  isTime: boolean;
  tag: string | TagModel;
  enabled: boolean;
  custom: AchievementCustomModel;
  hidden?: boolean;
  showProgress?: boolean;
}

export type AchievementWithBadgePopulated = AchievementModel<BadgeModel>;

export type AchievementDocument = AchievementModel & Document;

export interface AchievementUserProgressModel extends BaseModel {
  userId: string | UserModel;
  achievement: string | AchievementModel;
  value: number;
  progresses: [number, number][];
  progressesLength: number;
}

export type AchievementUserProgressDocument = AchievementUserProgressModel & Document;
