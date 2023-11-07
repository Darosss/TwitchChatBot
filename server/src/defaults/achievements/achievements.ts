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
      stages: stagesId,
      isTime: true
    },
    {
      name: ACHIEVEMENTS.POINTS,
      description: "Achievements for bot points",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.FOLLOWAGE,
      description: "Achievements for follow time",
      stages: stagesId,
      isTime: true
    },
    {
      name: ACHIEVEMENTS.COMMAS,
      description: "Achievements for at least one ',' in message",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.DICTATOR,
      description: "Achievements for '!' at end of message",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.DOTS,
      description: "Achievements for 'dot' at end of message",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.LONG_MESSAGES,
      description: "Achievements for long messages (15)",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.SHORT_MESSAGES,
      description: "Achievements for short messages (4)",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.MONKEY,
      description: "Achievements for at least one '@' in message",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.QUESTION_MARKS,
      description: "Achievements for '?' at end of message",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.XD,
      description: "Achievements for at least one 'xd' in message",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.POLISH_SWEARING,
      description: "Achievements for at least one 'polish swear' in message",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.KAPPA,
      description: "Achievements for at least one 'Kappa' in message",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.LUL,
      description: "Achievements for at least one 'LUL' in message",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.COMMANDS_COUNT,
      description: "Achievements for use of command",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.SONG_VOTING,
      description: "Achievements for 'like/dislike/unlike' in message",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.SONG_REQUEST,
      description: "Achievements for song requests in message",
      stages: stagesId
    },
    {
      name: ACHIEVEMENTS.BADGES_COUNT,
      description: "Achievements for user collected badges count",
      stages: stagesId
    }
  ];
};
