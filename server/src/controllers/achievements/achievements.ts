import { NextFunction, Request, Response } from "express";
import { RequestParams, RequestSearch } from "../types";
import {
  AchievementUpdateDataController,
  CustomAchievementCreateData,
  CustomAchievementUpdateData,
  createCustomAchievement,
  getAchievements,
  getAchievementsCount,
  getAchievementsProgressesByUserId as getAchievementsProgressesByUserIdService,
  deleteCustomAchievementById as deleteCustomAchievementByIdService,
  updateOneAchievement
} from "@services";
import { AppError, checkExistResource, logger } from "@utils";
import { filterAchievementsByUrlParams } from "./filters";
import { CustomAchievementAction } from "@models";

export const getManyAchievements = async (
  req: Request<{}, {}, {}, RequestSearch>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50, sortBy = "createdAt", sortOrder = "desc" } = req.query;

  const searchFilter = filterAchievementsByUrlParams(req.query);
  try {
    const affixes = await getAchievements(
      searchFilter,
      {
        limit: Number(limit),
        skip: Number(page),
        sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 }
      },
      { tag: true, stages: true, stagesBadge: true }
    );

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

export const editAchievementById = async (
  req: Request<RequestParams, {}, AchievementUpdateDataController, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { enabled, description, tag, stages, hidden } = req.body;
  const updateData = { enabled, description, stages, tag, hidden };

  try {
    const updatedAchievement = await updateOneAchievement({ _id: id }, updateData);

    const foundAchievement = checkExistResource(updatedAchievement, "Achievement");
    return res.status(200).send({
      message: "Achievement updated successfully",
      data: foundAchievement
    });
  } catch (err) {
    logger.error(`Error when trying to editAchievementById by id: ${id}: ${err}`);
    next(err);
  }
};

export const addCustomAchievement = async (
  req: Request<{}, {}, CustomAchievementCreateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { name, description, custom, stages, tag, enabled, hidden } = req.body;

  const createData = {
    name,
    enabled,
    description,
    custom,
    stages,
    tag,
    hidden,
    isTime: custom?.action === CustomAchievementAction.WATCH_TIME ? true : false
  };
  try {
    if (!custom) throw new AppError(400, `Custom options must be provided.`);
    const newCustomAchievement = await createCustomAchievement(createData);

    return res.status(200).send({ message: "Custom achievement added successfully", data: newCustomAchievement });
  } catch (err) {
    logger.error(`Error when trying to addCustomAchievement: ${err}`);
    next(err);
  }
};

export const deleteCustomAchievementById = async (
  req: Request<RequestParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    await deleteCustomAchievementByIdService(id);

    return res.status(200).send({ message: "Achievement deleted successfully" });
  } catch (err) {
    logger.error(`Error when trying to deleteCustomAchievementById by id: ${id}: ${err}`);
    next(err);
  }
};

export const editCustomAchievementById = async (
  req: Request<RequestParams, {}, CustomAchievementUpdateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, enabled, description, custom, stages, tag, hidden } = req.body;
  const updateData = {
    name,
    enabled,
    description,
    custom,
    stages,
    tag,
    hidden,
    isTime: custom?.action === CustomAchievementAction.WATCH_TIME ? true : false
  };

  try {
    const updatedAchievement = await updateOneAchievement({ _id: id }, updateData);

    const foundAchievement = checkExistResource(updatedAchievement, "Achievement");
    return res.status(200).send({
      message: "Custom achievement updated successfully",
      data: foundAchievement
    });
  } catch (err) {
    logger.error(`Error when trying to editCustomAchievementById by id: ${id}: ${err}`);
    next(err);
  }
};
