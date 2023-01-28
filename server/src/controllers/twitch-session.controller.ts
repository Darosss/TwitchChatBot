import Express, { Request, Response } from "express";
import { TwitchSession } from "@models/twitch-session.model";

const getTwitchSessions = async (req: Request, res: Response) => {
  const { page = 1, limit = 50 } = req.query as unknown as {
    page: number;
    limit: number;
  };

  try {
    const twitchSessions = await TwitchSession.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select({ __v: 0 })
      .sort({ sessionStart: -1 })
      .exec();

    const count = await TwitchSession.countDocuments();

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
