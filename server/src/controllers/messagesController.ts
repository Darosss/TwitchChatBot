import Express, { NextFunction, Request, Response } from "express";
import { IRequestQueryMessage } from "@types";
import { filterMessagesByUrlParams } from "./filters/messagesFilter";
import { getMessages, getMessagesCount } from "@services/messages";

export const getMessagesList = async (
  req: Request<{}, {}, {}, IRequestQueryMessage>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = await filterMessagesByUrlParams(req.query);
  try {
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
