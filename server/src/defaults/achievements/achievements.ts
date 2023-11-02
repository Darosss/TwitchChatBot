import { AchievementCreateData } from "services/achievements/types";
import { ACHIEVEMENTS } from "./types";

export const getDefaultAchievementsData = (stagesId: string): AchievementCreateData[] => {
  return [
    {
      name: ACHIEVEMENTS.CHAT_MESSAGES,
      description: "Achievements for chat messages",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.WATCH_TIME,
      description: "Achievements for watch time",
      stages: stagesId
    }
  ];
};
