import Express, { Request, Response } from "express";
import { Message } from "../models/message.model";

const getMessages = async (req: Request, res: Response) => {
  const { page = 1, limit = 50 } = req.query as unknown as {
    page: number;
    limit: number;
  };

  try {
    const messages = await Message.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Message.countDocuments();

    res.status(200).send({
      messages,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);

    res.status(200).send({ message: "Couldn't get messages" });
  }
};

export { getMessages };
