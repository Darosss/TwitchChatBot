import { NextFunction, Request, Response } from "express";
import { RequestParams, RequestTimerQuery } from "@types";
import { filterTimersByUrlParams } from "./filters";
import {
  createTimer,
  deleteTimerById,
  getTimers,
  getTimersCount,
  updateTimerById,
  TimerCreateData,
  TimerUpdateData
} from "@services";

export const getTimersList = async (req: Request<{}, {}, {}, RequestTimerQuery>, res: Response, next: NextFunction) => {
  const { page = 1, limit = 50, sortBy = "createdAt", sortOrder = "desc" } = req.query;

  const searchFilter = filterTimersByUrlParams(req.query);
  try {
    const timers = await getTimers(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      populate: [
        { path: "tag", select: { _id: 1, name: 1, enabled: 1 } },
        { path: "mood", select: { _id: 1, name: 1, enabled: 1 } }
      ],
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 }
    });

    const count = await getTimersCount(searchFilter);

    return res.status(200).send({
      data: timers,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const addNewTimer = async (req: Request<{}, {}, TimerCreateData, {}>, res: Response, next: NextFunction) => {
  const {
    name,
    messages,
    enabled = true,
    delay,
    nonFollowMulti,
    tag,
    mood,
    nonSubMulti,
    reqPoints,
    description
  } = req.body;

  const createData = { name, messages, enabled, reqPoints, description, delay, tag, mood, nonFollowMulti, nonSubMulti };

  try {
    const newTimer = await createTimer(createData);

    return res.status(200).send({ message: "Timmer added successfully", data: newTimer });
  } catch (err) {
    next(err);
  }
};

export const editTimerById = async (
  req: Request<RequestParams, {}, TimerUpdateData, {}>,
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
    tag,
    mood,
    nonSubMulti,
    reqPoints,
    description
  } = req.body;
  const updateData = { name, enabled, delay, messages, nonFollowMulti, nonSubMulti, reqPoints, description, tag, mood };
  try {
    const updatedTimer = await updateTimerById(id, updateData);

    return res.status(200).send({
      message: "Timmer updated successfully",
      data: updatedTimer
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTimer = async (req: Request<RequestParams, {}, {}, {}>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await deleteTimerById(id);

    return res.status(200).send({ message: "Timmer deleted successfully" });
  } catch (err) {
    next(err);
  }
};
