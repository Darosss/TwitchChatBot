import Express, { Request, Response } from "express";
import { Message } from "@models/message.model";
import { TwitchSession } from "@models/twitch-session.model";
import { IRequestQuery } from "@types";

const getMessages = async (req: Request, res: Response) => {
  const { page = 1, limit = 50 } = req.query as unknown as IRequestQuery;

  try {
    const messages = await Message.find()
      .limit(limit * 1)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .populate({
        path: "owner",
        select: "username",
      })
      .select({ __v: 0 })
      .exec();

    const count = await Message.countDocuments();

    res.status(200).send({
      messages,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({ message: "Couldn't get messages" });
  }
};

const getUserMessages = async (req: Request, res: Response) => {
  const { page = 1, limit = 50 } = req.query as unknown as IRequestQuery;
  const { id } = req.params;
  try {
    const messages = await Message.find({ owner: id })
      .limit(limit * 1)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .populate({
        path: "owner",
        select: "username",
      })
      .select({ __v: 0 })
      .exec();

    const count = await Message.find({ owner: id }).countDocuments();

    res.status(200).send({
      messages,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({ message: "Couldn't get messages" });
  }
};

const getLatestAndFirstMsgs = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { limit = 6 } = req.query as unknown as IRequestQuery;

  try {
    const messages = await Message.find({ owner: id })
      .sort({ date: -1 })
      .populate({
        path: "owner",
        select: "username",
      })
      .select({ __v: 0 })
      .exec();

    const firstMessages = messages.slice(0, limit);
    const latestMessages = messages.slice(-limit);

    res.status(200).send({
      firstMessages: firstMessages,
      latestMessages: latestMessages,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({ message: "Couldn't get messages" });
  }
};

const getSessionMessages = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query as unknown as IRequestQuery;
  try {
    const session = await TwitchSession.findById(id);

    const messages = await Message.find({
      date: {
        $gte: session?.sessionStart,
        $lte: session?.sessionEnd,
      },
    })
      .limit(limit * 1)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .populate({
        path: "owner",
        select: "username",
      })
      .select({ __v: 0 })
      .exec();

    const count = await Message.find().countDocuments();

    res.status(200).send({
      messages,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({ message: "Couldn't get messages from session" });
  }
};
export {
  getMessages,
  getUserMessages,
  getLatestAndFirstMsgs,
  getSessionMessages,
};
