import Express, { NextFunction, Request, Response } from "express";
import { IRequestTriggerQuery } from "@types";
import { filterTriggersByUrlParams } from "./filters/triggersFilter";
import {
  createTrigger,
  deleteTriggerById,
  getTriggers,
  getTriggersCount,
  updateTriggerById,
} from "@services/triggers";

export const getTriggersList = async (
  req: Request<{}, {}, {}, IRequestTriggerQuery>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterTriggersByUrlParams(req.query);
  try {
    const triggers = await getTriggers(searchFilter, {
      limit: limit,
      skip: page,
      sort: { createdAt: -1 },
    });

    const count = await getTriggersCount(searchFilter);

    return res.status(200).send({
      data: triggers,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

export const addNewTrigger = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    chance,
    delay,
    words,
    messages,
    enabled = true,
    mode,
  } = req.body;

  try {
    const newTrigger = await createTrigger({
      name: name,
      chance: chance,
      enabled: enabled,
      delay: delay,
      messages: messages,
      words: words,
      mode: mode,
    });

    return res
      .status(200)
      .send({ message: "Trigger added successfully", trigger: newTrigger });
  } catch (err) {
    next(err);
  }
};

export const editTriggerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const {
    name,
    chance,
    delay,
    words,
    messages,
    enabled = true,
    mode,
  } = req.body;

  try {
    const updatedTrigger = await updateTriggerById(id, {
      name: name,
      chance: chance,
      enabled: enabled,
      delay: delay,
      messages: messages,
      words: words,
      mode: mode,
    });

    return res.status(200).send({
      message: "Trigger updated successfully",
      data: updatedTrigger,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTrigger = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedTrigger = await deleteTriggerById(id);

    return res.status(200).send({ message: "Trigger deleted successfully" });
  } catch (err) {
    next(err);
  }
};
