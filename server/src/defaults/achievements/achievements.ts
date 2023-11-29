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
      name: ACHIEVEMENTS.EMOTES_COUNT,
      description: "Achievements for use chat emotes",
      stages: stagesId,
      tag: tagId
    },
    {
      name: ACHIEVEMENTS.RANDOMLY_CHOOSEN,
      description: "Achievements given at random time with random percent",
      stages: stagesId,
      tag: tagId,
      showProgress: true
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
      name: ACHIEVEMENTS.BOUGHT_SUBSCRIBTIONS,
      description: "Achievements for bought subscriptions for channel",
      stages: stagesId,
      tag: tagId,
      showProgress: true
    },
    {
      name: ACHIEVEMENTS.SUBSCRIBTIONS_TIER_1,
      description: "Achievements for subscribes channel with at least tier 1 (tiers 2 and 3 are counted)",
      stages: stagesId,
      tag: tagId,
      showProgress: true
    },
    {
      name: ACHIEVEMENTS.SUBSCRIBTIONS_TIER_2,
      description: "Achievements for subscribes channel with at least tier 2(tiers 3 are counted)",
      stages: stagesId,
      tag: tagId,
      showProgress: true
    },
    {
      name: ACHIEVEMENTS.SUBSCRIBTIONS_TIER_3,
      description: "Achievements for subscribes channel with tier 3",
      stages: stagesId,
      tag: tagId,
      showProgress: true
    },
    {
      name: ACHIEVEMENTS.SENT_SUBSCRIBTIONS_GIFTS_CUMULATIVE,
      description: "Achievements for gifting a subscribes to other users cumulative(counting all tier 1, 2 and 3)",
      stages: stagesId,
      tag: tagId,
      showProgress: true
    },
    {
      name: ACHIEVEMENTS.SENT_SUBSCRIBTIONS_GIFTS_TIER_1,
      description: "Achievements for gifting a subscribes to other users cumulative(only for tier 1 subs)",
      stages: stagesId,
      tag: tagId,
      showProgress: true
    },
    {
      name: ACHIEVEMENTS.SENT_SUBSCRIBTIONS_GIFTS_TIER_2,
      description: "Achievements for gifting a subscribes to other users cumulative(only for tier 2 subs)",
      stages: stagesId,
      tag: tagId,
      showProgress: true
    },
    {
      name: ACHIEVEMENTS.SENT_SUBSCRIBTIONS_GIFTS_TIER_3,
      description: "Achievements for gifting a subscribes to other users cumulative(only for tier 3 subs)",
      stages: stagesId,
      tag: tagId,
      showProgress: true
    },
    {
      name: ACHIEVEMENTS.SENT_SUBSCRIBTIONS_GIFTS_AS_PACK_TIER_1,
      description:
        "Achievements for gifting a subscribes choosen amounts at once to other users fe. 20 at once (only for tier 1 subs, max 100)",
      stages: stagesId,
      tag: tagId
    },
    {
      name: ACHIEVEMENTS.SENT_SUBSCRIBTIONS_GIFTS_AS_PACK_TIER_2,
      description:
        "Achievements for gifting a subscribes choosen amounts at once to other users fe. 20 at once (only for tier 2 subs, max 100)",
      stages: stagesId,
      tag: tagId
    },
    {
      name: ACHIEVEMENTS.SENT_SUBSCRIBTIONS_GIFTS_AS_PACK_TIER_3,
      description:
        "Achievements for gifting a subscribes choosen amounts at once to other users fe. 20 at once (only for tier 3 subs, max 40)",
      stages: stagesId,
      tag: tagId
    },
    {
      name: ACHIEVEMENTS.RECEIVED_SUBSCRIBTIONS_GIFTS,
      description: "Achievements for getting a subscribes gifts from other users",
      stages: stagesId,
      tag: tagId,
      showProgress: true
    },
    {
      name: ACHIEVEMENTS.SENT_CHEERS,
      description: "Achievements for sending cheers cumulative to channel",
      stages: stagesId,
      tag: tagId,
      showProgress: true
    },
    {
      name: ACHIEVEMENTS.SENT_CHEERS_AS_PACK,
      description: "Achievements for sending cheers choosen amounts at once to channel",
      stages: stagesId,
      tag: tagId
    },
    {
      name: ACHIEVEMENTS.RAID_FROM,
      description: "Achievements for raid a channel with choosen amount of viewers",
      stages: stagesId,
      tag: tagId,
      showProgress: true
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
