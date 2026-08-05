import { Document, Types } from "mongoose";
import { BaseModel } from "../types";
import { BadgeModel } from "../badges/types";
import { UserModel } from "../users/types";
import { TagModel } from "../tags/types";
import { CustomAchievementAction } from "./enums";

export type StageDataRarity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export interface StageData<T extends BadgeModel | Types.ObjectId = Types.ObjectId> {
  name: string;
  stage: number;
  goal: number;
  badge: T;
  showTimeMs: number;
  sound?: string;
  rarity?: StageDataRarity;
}
//TODO: when schema validate fix the frontend file achievements/exampleData.ts
export type StageDataWithBadgePopulated = StageData<BadgeModel>;
export interface AchievementStageModel<T extends BadgeModel | Types.ObjectId = Types.ObjectId> extends BaseModel {
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

export interface AchievementModel<
  StageType extends AchievementStageModel<BadgeModel | Types.ObjectId> | Types.ObjectId = Types.ObjectId
> extends BaseModel {
  name: string;
  description: string;
  stages: StageType;
  isTime: boolean;
  tag: string | TagModel;
  enabled: boolean;
  custom?: AchievementCustomModel;
  hidden?: boolean;
  showProgress?: boolean;
}

export type AchievementWithBadgePopulated = AchievementModel<AchievementStageModel<BadgeModel>>;

export type AchievementDocument = AchievementModel & Document;

export interface AchievementUserProgressModel<
  AchievementType extends
    | Types.ObjectId
    | AchievementModel<AchievementStageModel<Types.ObjectId | BadgeModel> | Types.ObjectId> = Types.ObjectId
> extends BaseModel {
  userId: string | UserModel;
  achievement: AchievementType;
  value: number;
  progresses: [number, number][];
  progressesLength: number;
}

export type AchievementUserProgressDocument = AchievementUserProgressModel & Document;
