import { NextFunction, Request, Response } from "express";
import {
  RequestParams,
  RequestQueryLatestEldestMsgs,
  RequestQueryMessage,
  RequestQueryUser,
  RequestRedemptionQuery
} from "@types";
import { filterUsersByUrlParams } from "./filters/usersFilter";
import { getUserById, getUserCount, getUsers, updateUserById, UserUpdateData } from "@services/users";

import { filterMessagesByUrlParams } from "./filters/messagesFilter";
import { getMessages, getMessagesCount } from "@services/messages";

import { getRedemptions, getRedemptionsCount } from "@services/redemptions";
import { filterRedemptionsByUrlParams } from "./filters/redemptionsFilter";

export const getUsersList = async (req: Request<{}, {}, {}, RequestQueryUser>, res: Response, next: NextFunction) => {
  const { page = 1, limit = 50, sortBy = "lastSeen", sortOrder = "desc" } = req.query;
  const searchFilter = filterUsersByUrlParams(req.query);
  try {
    const users = await getUsers(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 }
    });

    const count = await getUserCount(searchFilter);

    return res.status(200).send({
      data: users,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const getUsersProfile = async (req: Request<RequestParams, {}, {}, {}>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id, { select: { __v: 0 } });

    return res.status(200).send({ data: user });
  } catch (err) {
    next(err);
  }
};

export const editUserProfile = async (
  req: Request<RequestParams, {}, UserUpdateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { notes } = req.body;

  try {
    await updateUserById(id, { notes: notes });
    return res.status(200).send({ message: "Updated successfully" });
  } catch (err) {
    next(err);
  }
};

export const getUserMessages = async (
  req: Request<RequestParams, {}, {}, RequestQueryMessage>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = Object.assign({ owner: id }, await filterMessagesByUrlParams(req.query));

  try {
    const messages = await getMessages(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { date: -1 },
      select: { __v: 0 }
    });
    const count = await getMessagesCount(searchFilter);

    return res.status(200).send({
      data: messages,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const getUserRedemptions = async (
  req: Request<RequestParams, {}, {}, RequestRedemptionQuery>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = Object.assign({ userId: id }, filterRedemptionsByUrlParams(req.query));

  try {
    const redemptions = await getRedemptions(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { redemptionDate: -1 }
    });

    const count = await getRedemptionsCount(searchFilter);

    return res.status(200).send({
      data: redemptions,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const getLatestEldestUserMessages = async (
  req: Request<RequestParams, {}, {}, RequestQueryLatestEldestMsgs>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { limit = 6 } = req.query;

  try {
    const firstMessages = await getMessages(
      { owner: id },
      {
        limit: Number(limit),
        sort: { date: 1 },
        select: { __v: 0 }
      }
    );
    const latestMessages = await getMessages(
      { owner: id },
      {
        limit: Number(limit),
        sort: { date: -1 },
        select: { __v: 0 }
      }
    );

    return res.status(200).send({
      data: { firstMessages: firstMessages, latestMessages: latestMessages }
    });
  } catch (err) {
    next(err);
  }
};
