import Express, { NextFunction, Request, Response } from "express";
import { RequestTimerQuery } from "@types";
import { filterTimersByUrlParams } from "./filters/timersFilter";
import {
  createTimer,
  deleteTimerById,
  getTimers,
  getTimersCount,
  updateTimerById,
} from "@services/timers";

export const getTimersList = async (
  req: Request<{}, {}, {}, RequestTimerQuery>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterTimersByUrlParams(req.query);
  try {
    const timers = await getTimers(searchFilter, {
      limit: limit,
      skip: page,
      sort: { createdAt: -1 },
    });

    const count = await getTimersCount(searchFilter);

    return res.status(200).send({
      data: timers,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

export const addNewTimer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, messages, delay, points, reqPoints } = req.body;

  try {
    const newTimer = await createTimer({
      name: name,
      messages: messages,
      points: points,
      reqPoints: reqPoints,
      delay: delay,
    });

    return res
      .status(200)
      .send({ message: "Timmer added successfully", timmer: newTimer });
  } catch (err) {
    next(err);
  }
};

export const editTimerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const {
    name,
    messages,
    enabled = true,
    delay,
    nonFollowMulti,
    nonSubMulti,
    reqPoints,
    description,
  } = req.body;

  try {
    const updatedTimer = await updateTimerById(id, {
      name: name,
      enabled: enabled,
      delay: delay,
      messages: messages,
      nonFollowMulti: nonFollowMulti,
      nonSubMulti: nonSubMulti,
      reqPoints: reqPoints,
      description: description,
    });

    return res.status(200).send({
      message: "Timmer updated successfully",
      data: updatedTimer,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTimer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedTimer = await deleteTimerById(id);

    return res.status(200).send({ message: "Timmer deleted successfully" });
  } catch (err) {
    next(err);
  }
};
