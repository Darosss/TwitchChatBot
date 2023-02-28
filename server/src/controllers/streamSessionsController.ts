import Express, { Request, Response, NextFunction } from "express";
import {
  IRequestParams,
  IRequestQueryMessage,
  IRequestQuerySession,
  IRequestRedemptionQuery,
} from "@types";
import { filterSessionByUrlParams } from "./filters/sessionFilter";
import {
  getCurrentStreamSession,
  getStreamSessionStatistics,
  getStreamSessions,
  getStreamSessionsCount,
  getStreamSessionById,
  getLatestStreamSession,
} from "@services/streamSessions";
import { getMessages, getMessagesCount } from "@services/messages";
import { filterMessagesByUrlParams } from "./filters/messagesFilter";
import { getRedemptions, getRedemptionsCount } from "@services/redemptions";
import { filterRedemptionsByUrlParams } from "./filters/redemptionsFilter";

export const getStreamSessionsList = async (
  req: Request<{}, {}, {}, IRequestQuerySession>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterSessionByUrlParams(req.query);
  try {
    const streamSessions = await getStreamSessions(searchFilter, {
      limit: limit,
      skip: page,
      sort: { sessionStart: -1 },
    });

    const count = await getStreamSessionsCount(searchFilter);

    res.status(200).send({
      data: streamSessions,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

export const getCurrentSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let streamSession = await getCurrentStreamSession({});

    if (!streamSession) streamSession = await getLatestStreamSession({});

    res.status(200).send({
      data: streamSession,
    });
  } catch (err) {
    next(err);
  }
};

export const getSessionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const streamSession = await getStreamSessionById(id, {});

    return res.status(200).send({
      data: streamSession,
    });
  } catch (err) {
    next(err);
  }
};

export const getSessionStatisticsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const streamSession = await getStreamSessionById(id, {});

    const sessionStatstics = await getStreamSessionStatistics(streamSession!, {
      limitMostUsedWords: 10,
      limitTopMessageUsers: 10,
      limitTopRedemptionsUsers: 10,
      limitViewers: 0,
    });

    res.status(200).send({
      data: sessionStatstics,
    });
  } catch (err) {
    next(err);
  }
};

export const getCurrentSessionStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let streamSession = await getCurrentStreamSession({});

    if (!streamSession) {
      streamSession = await getLatestStreamSession({});
    }

    const sessionStatstics = await getStreamSessionStatistics(
      streamSession!,
      {}
    );
    res.status(200).send({
      data: sessionStatstics,
    });
  } catch (err) {
    next(err);
  }
};

export const getSessionMessages = async (
  req: Request<IRequestParams, {}, {}, IRequestQueryMessage>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query;

  try {
    const session = await getStreamSessionById(id, { select: { __v: 0 } });

    const searchFilter = Object.assign(
      {
        date: {
          $gte: session?.sessionStart,
          $lte: session?.sessionEnd,
        },
      },
      await filterMessagesByUrlParams(req.query)
    );

    const messages = await getMessages(searchFilter, {
      limit: limit,
      skip: page,
      sort: { date: -1 },
      select: { __v: 0 },
    });

    const count = await getMessagesCount(searchFilter);
    return res.status(200).send({
      data: messages,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

export const getSessionRedemptions = async (
  req: Request<IRequestParams, {}, {}, IRequestRedemptionQuery>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query;

  try {
    const session = await getStreamSessionById(id, { select: { __v: 0 } });

    const searchFilter = Object.assign(
      {
        redemptionDate: {
          $gte: session?.sessionStart,
          $lte: session?.sessionEnd,
        },
      },
      filterRedemptionsByUrlParams(req.query)
    );
    const redemptions = await getRedemptions(searchFilter, {
      limit: limit,
      skip: page,
      sort: { redemptionDate: -1 },
    });

    const count = await getRedemptionsCount(searchFilter);

    return res.status(200).send({
      data: redemptions,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};
