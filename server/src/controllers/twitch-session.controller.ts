import Express, { Request, Response } from "express";
import { IRequestQuerySession } from "@types";
import { filterSessionByUrlParams } from "./filters/session.filter";
import {
  getTwitchSessions,
  getTwitchSessionsCount,
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
      twitchSessions,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: "Internal server error" });
  }
};

export { getTwitchSessionsList };
