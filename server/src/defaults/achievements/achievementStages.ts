import { AchievementStageCreateData } from "services/achievements/types";

export const getDefaultAchievementStagesData = (badgeId: string): AchievementStageCreateData => {
  return {
    name: "DEFAULT_ACHIEVEMNT_STAGES",
    stageData: [
      { name: "Default stage", stage: 1, goal: 1, badge: badgeId },
      { name: "Default stage 2", stage: 2, goal: 10, badge: badgeId },
      { name: "Default stage 3 ", stage: 3, goal: 50, badge: badgeId }
    ]
  };
};
