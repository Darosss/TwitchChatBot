import Express, { Request, Response } from "express";
import { TwitchSession } from "@models/twitch-session.model";
import { IRequestQuerySession } from "@types";
import { filterSessionByUrlParams } from "./filters/session.filter";

const getTwitchSessions = async (
  req: Request<{}, {}, {}, IRequestQuerySession>,
  res: Response
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterSessionByUrlParams(req.query);
  try {
    const twitchSessions = await TwitchSession.find(searchFilter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select({ __v: 0 })
      .sort({ sessionStart: -1 })
      .exec();

    const count = await TwitchSession.countDocuments(searchFilter);

    res.status(200).send({
      twitchSessions,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({ message: "Couldn't get sessions" });
  }
};

export { getTwitchSessions };
