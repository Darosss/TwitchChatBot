import Express, { Request, Response, NextFunction } from "express";
import { IRequestQuerySession } from "@types";
import { filterSessionByUrlParams } from "./filters/session.filter";
import {
  getCurrentTwitchSession,
  getTwitchSessionStatistics,
  getTwitchSessions,
  getTwitchSessionsCount,
  getTwitchSessionById,
  getLatestTwitchSession,
} from "@services/TwitchSession";

const getTwitchSessionsList = async (
  req: Request<{}, {}, {}, IRequestQuerySession>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterSessionByUrlParams(req.query);
  try {
    const twitchSessions = await getTwitchSessions(searchFilter, {
      limit: limit,
      skip: page,
      sort: { sessionStart: -1 },
    });

    const count = await getTwitchSessionsCount(searchFilter);

    res.status(200).send({
      data: twitchSessions,
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
    let twitchSession = await getCurrentTwitchSession({});

    if (!twitchSession) twitchSession = await getLatestTwitchSession({});

    res.status(200).send({
      data: twitchSession,
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
    const twitchSession = await getTwitchSessionById(id, {});

    return res.status(200).send({
      data: twitchSession,
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
    const twitchSession = await getTwitchSessionById(id, {});

    const sessionStatstics = await getTwitchSessionStatistics(twitchSession!, {
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
    let twitchSession = await getCurrentTwitchSession({});

    if (!twitchSession) {
      twitchSession = await getLatestTwitchSession({});
    }

    const sessionStatstics = await getTwitchSessionStatistics(
      twitchSession!,
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
  getTwitchSessionsList,
  getCurrentSession,
  getSessionById,
  getCurrentSessionStatistics,
  getSessionStatisticsById,
};
