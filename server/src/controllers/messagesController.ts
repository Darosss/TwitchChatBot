import Express, { NextFunction, Request, Response } from "express";
import { IRequestParams, IRequestQuery, IRequestQueryMessage } from "@types";
import { filterMessagesByUrlParams } from "./filters/messagesFilter";
import { getMessages, getMessagesCount } from "@services/messages";
import { getStreamSessionById } from "@services/streamSessions";

const getMessagesList = async (
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

const getUserMessages = async (
  req: Request<IRequestParams, {}, {}, IRequestQueryMessage>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = Object.assign(
    { owner: id },
    await filterMessagesByUrlParams(req.query)
  );

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

const getLatestAndFirstMsgs = async (
  req: Request<IRequestParams, {}, {}, IRequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { limit = 6 } = req.query;

  try {
    const firstMessages = await getMessages(
      { owner: id },
      {
        limit: limit,
        sort: { date: 1 },
        select: { __v: 0 },
      }
    );
    const latestMessages = await getMessages(
      { owner: id },
      {
        limit: limit,
        sort: { date: -1 },
        select: { __v: 0 },
      }
    );

    return res.status(200).send({
      data: { firstMessages: firstMessages, latestMessages: latestMessages },
    });
  } catch (err) {
    next(err);
  }
};

const getSessionMessages = async (
  req: Request<IRequestParams, {}, {}, IRequestQueryMessage>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query;

  try {
    const session = await getStreamSessionById(id, { select: { __v: 0 } });

    const searchFilter = Object.assign(
      {
        date: {
          $gte: session?.sessionStart,
          $lte: session?.sessionEnd,
        },
      },
      await filterMessagesByUrlParams(req.query)
    );

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
export {
  getMessagesList,
  getUserMessages,
  getLatestAndFirstMsgs,
  getSessionMessages,
};
