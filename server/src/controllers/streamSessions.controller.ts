import Express, { Request, Response, NextFunction } from "express";
import { IRequestQuerySession } from "@types";
import { filterSessionByUrlParams } from "./filters/session.filter";
import {
  getCurrentStreamSession,
  getStreamSessionStatistics,
  getStreamSessions,
  getStreamSessionsCount,
  getStreamSessionById,
  getLatestStreamSession,
} from "@services/streamSessions";

const getStreamSessionsList = async (
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

const getCurrentSession = async (
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

const getSessionById = async (
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

const getSessionStatisticsById = async (
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

const getCurrentSessionStatistics = async (
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

export {
  getStreamSessionsList,
  getCurrentSession,
  getSessionById,
  getCurrentSessionStatistics,
  getSessionStatisticsById,
};
