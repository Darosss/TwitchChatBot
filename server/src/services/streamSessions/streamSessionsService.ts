import { StreamSession, StreamSessionModel, StreamSessionDocument } from "@models";
import {
  getMostActiveUsersByMsgs,
  getMostUsedWord,
  getMessagesCountByDate,
  getMostActiveUsersByRedemptions,
  getFollowersCount
} from "@services";
import { checkExistResource, handleAppError, getLastNItemsFromMap, logger } from "@utils";
import { FilterQuery, UpdateQuery } from "mongoose";
import {
  StreamSessionStatisticOptions,
  ManyStreamSessionsFindOptions,
  StreamSessionCreateData,
  StreamSessionFindOptions,
  StreamSessionOptionalData
} from "./types/";

export const getStreamSessions = async (
  filter: FilterQuery<StreamSessionDocument> = {},
  streamSessionFindOptions: ManyStreamSessionsFindOptions
) => {
  const { limit = 50, skip = 1, sort = { createdAt: -1 }, select = { __v: 0 } } = streamSessionFindOptions;
  try {
    const streamSessions = await StreamSession.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .sort(sort);

    return streamSessions;
  } catch (err) {
    logger.error(`Error occured while getting stream sessions. ${err}`);
    handleAppError(err);
  }
};

export const getStreamSessionById = async (id: string, streamSessionFindOptions: StreamSessionFindOptions) => {
  const { select = { __v: 0 } } = streamSessionFindOptions;

  try {
    const foundStreamSession = await StreamSession.findById(id).select(select).populate("events.user");

    const streamSession = checkExistResource(foundStreamSession, `Stream session with id(${id})`);

    return streamSession;
  } catch (err) {
    logger.error(`Error occured while getting stream session by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const getCurrentStreamSession = async (streamSessionFindOptions: StreamSessionFindOptions) => {
  const { select = { __v: 0 } } = streamSessionFindOptions;

  const currentDate = new Date();
  const filter = {
    $and: [
      { sessionStart: { $lte: currentDate } },
      {
        $or: [{ sessionEnd: { $gte: currentDate } }, { sessionEnd: { $exists: false } }]
      }
    ]
  };
  try {
    const streamSession = await StreamSession.findOne(filter)
      .sort({ sessionStart: -1 })
      .limit(1)
      .select(select)
      .populate("events.user");

    return streamSession;
  } catch (err) {
    logger.error(`Error occured while getting current stream session. ${err}`);
    handleAppError(err);
  }
};

export const updateCurrentStreamSession = async (updateData: UpdateQuery<StreamSessionOptionalData>) => {
  const currentStreamSession = await getCurrentStreamSession({});

  if (!currentStreamSession) return null;
  try {
    const updatedStreamSession = await StreamSession.findByIdAndUpdate(currentStreamSession.id, updateData, {
      new: true
    });

    return updatedStreamSession;
  } catch (err) {
    logger.error("Failed to update current stream session");
    handleAppError(err);
  }
};

export const getLatestStreamSession = async (streamSessionFindOptions: StreamSessionFindOptions) => {
  const { select = { __v: 0 } } = streamSessionFindOptions;

  try {
    const foundStreamSession = await StreamSession.findOne({})
      .sort({ sessionStart: -1 })
      .limit(1)
      .select(select)
      .populate("events.user");

    const streamSession = checkExistResource<StreamSessionDocument>(foundStreamSession, "Stream session");

    return streamSession;
  } catch (err) {
    logger.error(`Error occured while getting current stream session. ${err}`);
    handleAppError(err);
  }
};

export const getStreamSessionStatistics = async (
  session: StreamSessionModel,
  options: StreamSessionStatisticOptions
) => {
  const { sessionStart, sessionEnd, viewers } = session;
  const { limitTopRedemptionsUsers = 3, limitMostUsedWords = 3, limitTopMessageUsers = 3, limitViewers = 10 } = options;

  const viewersPeeks = new Map(getLastNItemsFromMap(viewers, limitViewers));

  const messagesCount = await getMessagesCountByDate(sessionStart, sessionEnd);
  const topActiveUsersByMsgs = await getMostActiveUsersByMsgs(limitTopMessageUsers, sessionStart, sessionEnd);
  const topActiveUsersByRedemptions = await getMostActiveUsersByRedemptions(
    limitTopRedemptionsUsers,
    sessionStart,
    sessionEnd
  );

  const topUsedWords = await getMostUsedWord(limitMostUsedWords, sessionStart, sessionEnd);

  const followersSession = await getFollowersCount(sessionStart, sessionEnd);

  return {
    messagesCount: messagesCount,
    topMsgsUsers: topActiveUsersByMsgs,
    topRedemptionsUsers: topActiveUsersByRedemptions,
    topUsedWords: topUsedWords,
    followersCount: followersSession,
    viewers: Object.fromEntries(viewersPeeks)
  };
};

export const getStreamSessionsCount = async (filter: FilterQuery<StreamSessionDocument> = {}) => {
  return await StreamSession.countDocuments(filter);
};

export const createStreamSession = async (streamSessionData: StreamSessionCreateData) => {
  try {
    const streamSession = await StreamSession.create(streamSessionData);
    return streamSession;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create stream session");
  }
};

export const updateStreamSessionById = async (id: string, updateData: UpdateQuery<StreamSessionOptionalData>) => {
  try {
    const streamSession = await StreamSession.findByIdAndUpdate(id, updateData, {
      new: true
    });
    return streamSession;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update stream session");
  }
};
