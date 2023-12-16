import { NextFunction, Request, Response } from "express";
import { RequestParams, RequestTriggerQuery } from "@types";
import { filterTriggersByUrlParams } from "./filters";
import {
  createTrigger,
  deleteTriggerById,
  getTriggers,
  getTriggersCount,
  updateTriggerById,
  TriggerCreateData,
  TriggerUpdateData
} from "@services";

export const getTriggersList = async (
  req: Request<{}, {}, {}, RequestTriggerQuery>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50, sortBy = "createdAt", sortOrder = "desc" } = req.query;

  const searchFilter = filterTriggersByUrlParams(req.query);
  try {
    const triggers = await getTriggers(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      populate: [
        { path: "tag", select: { _id: 1, name: 1, enabled: true } },
        { path: "mood", select: { _id: 1, name: 1, enabled: true } }
      ],
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 }
    });

    const count = await getTriggersCount(searchFilter);

    return res.status(200).send({
      data: triggers,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const addNewTrigger = async (
  req: Request<RequestParams, {}, TriggerCreateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { name, chance, delay, tag, mood, words, messages, enabled, mode } = req.body;
  const createData = { name, chance, tag, mood, enabled, delay, messages, words, mode };
  try {
    const newTrigger = await createTrigger(createData);

    return res.status(200).send({ message: "Trigger added successfully", data: newTrigger });
  } catch (err) {
    next(err);
  }
};

export const editTriggerById = async (
  req: Request<RequestParams, {}, TriggerUpdateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, chance, tag, mood, delay, words, messages, enabled, mode } = req.body;

  const updateData = { name, chance, enabled, tag, mood, delay, messages, words, mode };
  try {
    const updatedTrigger = await updateTriggerById(id, updateData);

    return res.status(200).send({
      message: "Trigger updated successfully",
      data: updatedTrigger
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTrigger = async (req: Request<RequestParams, {}, {}, {}>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await deleteTriggerById(id);

    return res.status(200).send({ message: "Trigger deleted successfully" });
  } catch (err) {
    next(err);
  }
};
