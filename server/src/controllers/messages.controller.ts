import Express, { Request, Response } from "express";
import { Message } from "../models/message.model";

interface IQueryMsgs {
  page?: number;
  limit?: number;
}

const getMessages = async (req: Request, res: Response) => {
  const { page = 1, limit = 50 } = req.query as unknown as IQueryMsgs;

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
      messageCount: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);

    res.status(200).send({ message: "Couldn't get messages" });
  }
};

const getUserMessages = async (req: Request, res: Response) => {
  const { page = 1, limit = 50 } = req.query as unknown as IQueryMsgs;
  const { id } = req.params;
  try {
    const messages = await Message.find({ owner: id })
      .limit(limit * 1)
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
      messageCount: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);

    res.status(200).send({ message: "Couldn't get messages" });
  }
};

export { getMessages, getUserMessages };
