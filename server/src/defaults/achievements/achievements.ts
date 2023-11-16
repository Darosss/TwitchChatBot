import { AchievementCreateData } from "services/achievements/types";
import { ACHIEVEMENTS } from "./types";

export const getDefaultAchievementsData = (stagesId: string, tagId: string): AchievementCreateData[] => {
  return [
    {
      name: ACHIEVEMENTS.CHAT_MESSAGES,
      description: "Achievements for chat messages",
      stages: stagesId,
      tag: tagId
    },
    {
      name: ACHIEVEMENTS.WATCH_TIME,
      description: "Achievements for watch time",
      stages: stagesId,
      tag: tagId,
      isTime: true
    },
    {
      name: ACHIEVEMENTS.POINTS,
      description: "Achievements for bot points",
      stages: stagesId,
      tag: tagId
    },
    {
      name: ACHIEVEMENTS.FOLLOWAGE,
      description: "Achievements for follow time",
      stages: stagesId,
      tag: tagId,
      isTime: true
    },
    {
      name: ACHIEVEMENTS.COMMANDS_COUNT,
      description: "Achievements for use of command",
      stages: stagesId,
      tag: tagId
    },
    {
      name: ACHIEVEMENTS.SONG_VOTING,
      description: "Achievements for 'like/dislike/unlike' in message",
      stages: stagesId,
      tag: tagId
    },
    {
      name: ACHIEVEMENTS.SONG_REQUEST,
      description: "Achievements for song requests in message",
      stages: stagesId,
      tag: tagId
    },
    {
      name: ACHIEVEMENTS.BADGES_COUNT,
      description: "Achievements for user collected badges count",
      stages: stagesId,
      tag: tagId
    }
  ];
};
