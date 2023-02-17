import { TwitchSession } from "@models/twitch-session.model";
import { ITwitchSessionDocument } from "@models/types";
import {
  getMostActiveUsersByMsgs,
  getMessagesCount,
  getMostUsedWord,
} from "@services/Message";
import { getMostActiveUsersByRedemptions } from "@services/Redemption";
import { getFollowersCount } from "@services/User";
import { FilterQuery, UpdateQuery } from "mongoose";
import {
  ManyTwitchSessionFindOptions,
  TwitchSessionCreateData,
  TwitchSessionFindOptions,
  TwitchSessionOptionalData,
} from "./types/TwitchSession";

export const getTwitchSessions = async (
  filter: FilterQuery<ITwitchSessionDocument> = {},
  twitchSessionFindOptions: ManyTwitchSessionFindOptions
) => {
  const {
    limit = 50,
    skip = 1,
    sort = { createdAt: -1 },
    select = { __v: 0 },
  } = twitchSessionFindOptions;

  const twitchSessions = await TwitchSession.find(filter)
    .limit(limit * 1)
    .skip((skip - 1) * limit)
    .select(select)
    .sort(sort);

  return twitchSessions;
};

export const getTwitchSessionById = async (
  id: string,
  twitchSessionFindOptions: TwitchSessionFindOptions
) => {
  const { select = { __v: 0 } } = twitchSessionFindOptions;

  const twitchSession = await TwitchSession.findById(id).select(select);

  return twitchSession;
};

export const getCurrentTwitchSession = async (
  twitchSessionFindOptions: TwitchSessionFindOptions
) => {
  const { select = { __v: 0 } } = twitchSessionFindOptions;

  const currentDate = new Date();
  const filter = {
    $and: [
      { sessionStart: { $lte: currentDate } },
      {
        $or: [
          { sessionEnd: { $gte: currentDate } },
          { sessionEnd: { $exists: false } },
        ],
      },
    ],
  };
  const twitchSession = await TwitchSession.find(filter)
    .sort({ sessionStart: -1 })
    .limit(1)
    .select(select);

  return twitchSession[0];
};

export const getCurrentTwitchSessionStatistics = async () => {
  const currSession = await getCurrentTwitchSession({});
  const messagesCount = await getMessagesCount({
    date: {
      $gte: currSession.sessionStart,
      $lte: currSession.sessionEnd,
    },
  });

  const topActiveUsersByMsgs = await getMostActiveUsersByMsgs(
    3,
    currSession.sessionStart,
    currSession.sessionEnd
  );
  const topActiveUsersByRedemptions = await getMostActiveUsersByRedemptions(3);

  const topUsedWords = await getMostUsedWord(
    3,
    currSession.sessionStart,
    currSession.sessionEnd
  );

  const followersSession = await getFollowersCount(
    currSession.sessionStart,
    currSession.sessionEnd
  );

  return {
    messagesCount: messagesCount,
    topMsgsUsers: topActiveUsersByMsgs,
    topRedemptionsUsers: topActiveUsersByRedemptions,
    topUsedWords: topUsedWords,
    followersCount: followersSession,
  };
};

export const getTwitchSessionsCount = async (
  filter: FilterQuery<ITwitchSessionDocument> = {}
) => {
  return await TwitchSession.countDocuments(filter);
};

export const createTwitchSession = async (
  twitchSessionData: TwitchSessionCreateData
) => {
  try {
    const twitchSession = await TwitchSession.create(twitchSessionData);
    return twitchSession;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create twitch session");
  }
};

export const updateTwitchSessionById = async (
  id: string,
  updateData: UpdateQuery<TwitchSessionOptionalData>
) => {
  try {
    const twitchSession = await TwitchSession.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );
    return twitchSession;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update twitch session");
  }
};
