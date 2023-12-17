import { RequestSearch } from "../types";

export interface RequestAchievementQuery extends RequestSearch {
  custom_action?: string;
}
export interface RequestAchievementStageQuery extends RequestSearch {
  stageName?: string;
  sound?: string;
}
