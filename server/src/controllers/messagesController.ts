import Express, { NextFunction, Request, Response } from "express";
import { RequestQueryMessage } from "@types";
import { filterMessagesByUrlParams } from "./filters/messagesFilter";
import { getMessages, getMessagesCount } from "@services/messages";

export const getMessagesList = async (
  req: Request<{}, {}, {}, RequestQueryMessage>,
  res: Response,
  next: NextFunction
) => {
  const {
    page = 1,
    limit = 50,
    sortBy = "date",
    sortOrder = "desc",
  } = req.query;

  const searchFilter = await filterMessagesByUrlParams(req.query);
  try {
    const messages = await getMessages(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
      select: { __v: 0 },
    });

    const count = await getMessagesCount(searchFilter);
    return res.status(200).send({
      data: messages,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};
