import Express, { NextFunction, Request, Response } from "express";
import { RequestSearch } from "@types";
import { filterMoodsByUrlParams } from "./filters/moodsFilter";
import {
  createMood,
  deleteMoodById,
  getMoods,
  getMoodsCount,
  updateMoodById,
} from "@services/moods";

export const getMoodsList = async (
  req: Request<{}, {}, {}, RequestSearch>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterMoodsByUrlParams(req.query);
  try {
    const moods = await getMoods(searchFilter, {
      limit: limit,
      skip: page,
      sort: { createdAt: -1 },
    });

    const count = await getMoodsCount(searchFilter);

    return res.status(200).send({
      data: moods,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

export const addNewMood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  try {
    const newMood = await createMood({ name: name });

    return res
      .status(200)
      .send({ message: "Mood added successfully", mood: newMood });
  } catch (err) {
    next(err);
  }
};

export const editMoodById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, enabled } = req.body;

  try {
    const updatedMood = await updateMoodById(id, {
      name: name,
      enabled: enabled,
    });

    return res.status(200).send({
      message: "Mood updated successfully",
      data: updatedMood,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteMood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedMood = await deleteMoodById(id);

    return res.status(200).send({ message: "Mood deleted successfully" });
  } catch (err) {
    next(err);
  }
};
