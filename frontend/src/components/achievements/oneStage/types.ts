import { AchievementStageData } from "@services";
export type UpdateStageDataByIndexFn = (
  index: number,
  updateData: AchievementStageData
) => void;
