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

export const getAchievementStages = async (
  filter: FilterQuery<AchievementStageDocument> = {},
  affixFindOptions: ManyAchievementsFindOptions<AchievementStageDocument>
) => {
  const { limit = 50, skip = 1, sort = { createdAt: -1 }, select = { __v: 0 } } = affixFindOptions;

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
  achievementFindOptions: AchievementsFindOptions<AchievementStageDocument>
) => {
  const { select = { __v: 0 } } = achievementFindOptions;
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
  achievementUpdateData: UpdateQuery<AchievementStageUpdateData>
) => {
  try {
    const updatedAchievement = await AchievementStage.findOneAndUpdate(filter, achievementUpdateData, {
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
