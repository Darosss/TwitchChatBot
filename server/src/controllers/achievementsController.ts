import { NextFunction, Request, Response } from "express";
import { RequestParams, RequestSearch } from "@types";
import {
  getAchievements,
  getAchievementsCount,
  getAchievementsProgressesByUserId as getAchievementsProgressesByUserIdService,
  getAchievementStagesByAchievementId as getAchievementStagesByAchievementIdService
} from "@services";
import { AppError } from "@utils";
import { filterAchievementsByUrlParams } from "./filters/achievementsFilter";

export const getManyAchievements = async (
  req: Request<{}, {}, {}, RequestSearch>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50, sortBy = "createdAt", sortOrder = "desc" } = req.query;

  const searchFilter = filterAchievementsByUrlParams(req.query);
  try {
    const affixes = await getAchievements(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 }
    });

    const count = await getAchievementsCount(searchFilter);

    return res.status(200).send({
      data: affixes,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const getAchievementsProgressesByUserId = async (
  req: Request<RequestParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id) throw new AppError(400, "Id not provided");

  try {
    const achievements = await getAchievementsProgressesByUserIdService(id);

    return res.status(200).send({
      data: achievements
    });
  } catch (err) {
    next(err);
  }
};

export const getAchievementStageByAchievementId = async (
  req: Request<RequestParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) throw new AppError(400, "Id not provided");

  try {
    const achievementStage = await getAchievementStagesByAchievementIdService(id, { __v: 0 });

    return res.status(200).send({
      data: achievementStage
    });
  } catch (err) {
    next(err);
  }
};
