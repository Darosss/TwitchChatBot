import { NextFunction, Request, Response } from "express";
import { RequestParams, RequestSearch } from "../types";
import { filterMoodsByUrlParams } from "./filters";
import {
  createMood,
  deleteMoodById,
  getMoods,
  getMoodsCount,
  updateMoodById,
  MoodCreateData,
  MoodUpdateData
} from "@services";

export const getMoodsList = async (req: Request<{}, {}, {}, RequestSearch>, res: Response, next: NextFunction) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterMoodsByUrlParams(req.query);
  try {
    const moods = await getMoods(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { createdAt: -1 }
    });

    const count = await getMoodsCount(searchFilter);

    return res.status(200).send({
      data: moods,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const addNewMood = async (req: Request<{}, {}, MoodCreateData, {}>, res: Response, next: NextFunction) => {
  const { name } = req.body;

  try {
    const newMood = await createMood({ name });

    return res.status(200).send({ message: "Mood added successfully", mood: newMood });
  } catch (err) {
    next(err);
  }
};

export const editMoodById = async (
  req: Request<RequestParams, {}, MoodUpdateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, enabled } = req.body;

  const updateData = { name, enabled };
  try {
    const updatedMood = await updateMoodById(id, updateData);

    return res.status(200).send({
      message: "Mood updated successfully",
      data: updatedMood
    });
  } catch (err) {
    next(err);
  }
};

export const deleteMood = async (req: Request<RequestParams, {}, {}, {}>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await deleteMoodById(id);

    return res.status(200).send({ message: "Mood deleted successfully" });
  } catch (err) {
    next(err);
  }
};
