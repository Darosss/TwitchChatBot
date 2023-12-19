import { AchievementStage, AchievementStageDocument } from "@models";
import { FilterQuery, UpdateQuery } from "mongoose";
import {
  AchievementStageCreateData,
  AchievementStageUpdateData,
  AchievementStagesPopulateOptions,
  AchievementsFindOptions,
  ManyAchievementsFindOptions
} from "./types";
import { AppError, checkExistResource, handleAppError, logger } from "@utils";
import { getAchievements } from "./achievementsService";
import path from "path";
import { achievementsStagesSoundsPath } from "@configs";
import { promises as fsPromises } from "fs";

export const getAchievementStages = async (
  filter: FilterQuery<AchievementStageDocument> = {},
  findOptions: ManyAchievementsFindOptions<AchievementStageDocument>
) => {
  const { limit = 50, skip = 1, sort = { createdAt: -1 }, select = { __v: 0 } } = findOptions;

  try {
    const affix = await AchievementStage.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .sort(sort);

    return affix;
  } catch (err) {
    logger.error(`Error occured while getting achievement stages. ${err}`);
    handleAppError(err);
  }
};

export const createAchievementStage = async (createData: AchievementStageCreateData) => {
  try {
    const createdAchievementStage = await AchievementStage.create(createData);

    if (!createdAchievementStage) {
      throw new AppError(400, "Couldn't create new achievement stage");
    }
    return createdAchievementStage;
  } catch (err) {
    logger.error(`Error occured while creating achievement stage. ${err}`);
    handleAppError(err);
  }
};

export const getAchievementStagesCount = async (filter: FilterQuery<AchievementStageDocument> = {}) => {
  return await AchievementStage.countDocuments(filter);
};

export const getOneAchievementStage = async (
  filter: FilterQuery<AchievementStageDocument> = {},
  findOptions: AchievementsFindOptions<AchievementStageDocument>
) => {
  const { select = { __v: 0 } } = findOptions;
  try {
    const foundAchievement = await AchievementStage.findOne(filter).select(select);

    return foundAchievement;
  } catch (err) {
    logger.error(`Error occured while getting achievement stage. ${err}`);
    handleAppError(err);
  }
};

export const updateOneAchievementStage = async (
  filter: FilterQuery<AchievementStageDocument>,
  updateData: UpdateQuery<AchievementStageUpdateData>
) => {
  try {
    const updatedAchievement = await AchievementStage.findOneAndUpdate(filter, updateData, {
      new: true
    });

    const achievementStage = checkExistResource(updatedAchievement, "AchievementStage");

    return achievementStage;
  } catch (err) {
    logger.error(`Error occured while updating achievement stage with (${JSON.stringify(filter)}). ${err}`);
    handleAppError(err);
  }
};
//TOOD: add select opts instead alone populateOptions
export const getAchievementStagesById = async (
  id: string,
  filter: FilterQuery<AchievementStageDocument> = {},
  populateOptions?: AchievementStagesPopulateOptions
) => {
  try {
    const achievementStage = await AchievementStage.findOne({ _id: id }, filter).populate([
      ...(populateOptions?.stageDataBadge ? [{ path: "stageData.badge" }] : [])
    ]);

    const existingAchievementStage = checkExistResource(achievementStage, "Achievement stage");
    return existingAchievementStage;
  } catch (err) {
    logger.error(`Error occured while getAchievementStagesById with id: ${id} ${err}`);
    handleAppError(err);
  }
};

export const deleteAchievementStageById = async (id: string) => {
  try {
    const containingAchievements = (await getAchievements({ stages: id }, {})) || [];

    if (containingAchievements.length > 0) {
      throw new AppError(
        409,
        `Achievement stage with id(${id}) is used in achievement(s): [${containingAchievements
          .map(({ name }) => name)
          .join(", ")}], cannot delete`
      );
    }

    await AchievementStage.findByIdAndDelete(id);

    return { message: "Successfully removed achievement stage" };
  } catch (err) {
    logger.error(`Error occured while deleting badge by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const deleteAchievementSound = async (soundName: string) => {
  try {
    const foundContainingStages =
      (await getAchievementStages({ "stageData.sound": { $regex: soundName, $options: "i" } }, {})) || [];
    if (foundContainingStages.length > 0) {
      throw new AppError(
        409,
        `Achievement stage sound  with name: (${soundName}) is used in ahchievement stage sound(s): [${foundContainingStages
          .map(({ name }) => name)
          .join(", ")}], cannot delete`
      );
    }

    const filePath = path.join(achievementsStagesSoundsPath, soundName);

    await fsPromises.unlink(filePath);

    return `Achievement stage sound  ${soundName} deleted successfully`;
  } catch (err) {
    logger.error(`Error occured while deleting ahchievement stage sound  by name(${soundName}). ${err}`);
    handleAppError(err);
  }
};
