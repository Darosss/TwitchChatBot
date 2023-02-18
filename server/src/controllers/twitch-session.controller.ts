import Express, { Request, Response } from "express";
import { IRequestQuerySession } from "@types";
import { filterSessionByUrlParams } from "./filters/session.filter";
import {
  getCurrentTwitchSession,
  getTwitchSessionStatistics,
  getTwitchSessions,
  getTwitchSessionsCount,
  getTwitchSessionById,
} from "@services/TwitchSession";

const getTwitchSessionsList = async (
  req: Request<{}, {}, {}, IRequestQuerySession>,
  res: Response
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
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: "Internal server error" });
  }
};

const getCurrentSession = async (req: Request, res: Response) => {
  try {
    const twitchSession = await getCurrentTwitchSession({});

    if (!twitchSession)
      return res.status(400).send({ message: "Couldn't find any session" });

    res.status(200).send({
      data: twitchSession,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: "Internal server error" });
  }
};

const getSessionById = async (req: Request, res: Response) => {};

const getSessionStatisticsById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const twitchSession = await getTwitchSessionById(id, {});
    if (!twitchSession) {
      return res.status(400).send({ message: "Couldn't find any session" });
    }

    const sessionStatstics = await getTwitchSessionStatistics(twitchSession);

    if (!sessionStatstics) {
      return res
        .status(400)
        .send({ message: "Couldn't find any session statistics" });
    }
    res.status(200).send({
      data: sessionStatstics,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: "Internal server error" });
  }
};

const getCurrentSessionStatistics = async (req: Request, res: Response) => {
  try {
    const twitchSession = await getCurrentTwitchSession({});
    if (!twitchSession) {
      return res.status(400).send({ message: "Couldn't find any session" });
    }

    const sessionStatstics = await getTwitchSessionStatistics(twitchSession);

    if (!sessionStatstics) {
      return res
        .status(400)
        .send({ message: "Couldn't find any session statistics" });
    }
    res.status(200).send({
      data: sessionStatstics,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: "Internal server error" });
  }
};

export {
  getTwitchSessionsList,
  getCurrentSession,
  getSessionById,
  getCurrentSessionStatistics,
  getSessionStatisticsById,
};
