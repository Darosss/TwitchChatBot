import { Achievement, AchievementDocument, AchievementWithBadgePopulated } from "@models";
import { AppError, checkExistResource, handleAppError, logger } from "@utils";
import { FilterQuery, UpdateQuery } from "mongoose";
import {
  AchievementCreateData,
  AchievementsFindOptions,
  AchievementUpdateData,
  ManyAchievementsFindOptions
} from "./types";

export const getAchievements = async (
  filter: FilterQuery<AchievementDocument> = {},
  affixFindOptions: ManyAchievementsFindOptions
) => {
  const { limit = 50, skip = 1, sort = { createdAt: -1 }, select = { __v: 0 } } = affixFindOptions;

  try {
    const affix = await Achievement.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .populate({
        path: "stages",
        populate: {
          path: "stageData.badge"
        }
      })
      .sort(sort);

    return affix;
  } catch (err) {
    logger.error(`Error occured while getting achievements. ${err}`);
    handleAppError(err);
  }
};

export const createAchievement = async (createData: AchievementCreateData) => {
  try {
    const createdAchievement = await Achievement.create(createData);

    if (!createdAchievement) {
      throw new AppError(400, "Couldn't create new achievement");
    }
    return createdAchievement;
  } catch (err) {
    logger.error(`Error occured while creating achievement. ${err}`);
    handleAppError(err);
  }
};

export const getAchievementsCount = async (filter: FilterQuery<AchievementDocument> = {}) => {
  return await Achievement.countDocuments(filter);
};

export const getOneAchievement = async (
  filter: FilterQuery<AchievementDocument> = {},
  achievementFindOptions: AchievementsFindOptions
) => {
  const { select = { __v: 0 } } = achievementFindOptions;
  try {
    const foundAchievement: AchievementWithBadgePopulated | null = await Achievement.findOne(filter)
      .select(select)
      .populate({
        path: "stages",
        populate: {
          path: "stageData.badge"
        }
      });

    return foundAchievement;
  } catch (err) {
    logger.error(`Error occured while getting achievement. ${err}`);
    handleAppError(err);
  }
};

export const updateOneAchievement = async (
  filter: FilterQuery<AchievementDocument>,
  achievementUpdateData: UpdateQuery<AchievementUpdateData>
) => {
  try {
    const updatedAchievement = await Achievement.findOneAndUpdate(filter, achievementUpdateData, {
      new: true
    });

    const achievement = checkExistResource(updatedAchievement, "Achievement");

    return achievement;
  } catch (err) {
    logger.error(`Error occured while updating achievement with (${JSON.stringify(filter)}). ${err}`);
    handleAppError(err);
  }
};
