import {
  Achievement,
  AchievementCustomModel,
  AchievementDocument,
  AchievementWithBadgePopulated,
  CustomAchievementAction
} from "@models";
import { AppError, checkExistResource, handleAppError, logger } from "@utils";
import { FilterQuery, UpdateQuery } from "mongoose";
import {
  AchievementCreateData,
  AchievementsFindOptions,
  AchievementUpdateData,
  AchievementsPopulateOptions,
  ManyAchievementsFindOptions,
  CustomAchievementCreateData
} from "./types";

export const getAchievements = async (
  filter: FilterQuery<AchievementDocument> = {},
  findOptions: ManyAchievementsFindOptions,
  //TODO: move this into achievementsFindOptions as optional
  populateOptions?: AchievementsPopulateOptions
) => {
  const { limit = 50, skip = 1, sort = { createdAt: -1 }, select = { __v: 0 } } = findOptions;

  try {
    const affix = await Achievement.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .populate([
        ...(populateOptions?.stages
          ? [
              {
                path: "stages",
                ...(populateOptions.stagesBadge && {
                  populate: {
                    path: "stageData.badge"
                  }
                })
              }
            ]
          : []),
        ...(populateOptions?.tag
          ? [
              {
                path: "tag",
                select: "name enabled"
              }
            ]
          : [])
      ])
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
  findOptions: AchievementsFindOptions,
  //TODO: add populate opts
  populateTag?: boolean
) => {
  const { select = { __v: 0 } } = findOptions;
  try {
    const foundAchievement: AchievementWithBadgePopulated | null = await Achievement.findOne(filter)
      .select(select)
      .populate([
        {
          path: "stages",
          populate: {
            path: "stageData.badge"
          }
        },
        ...(populateTag ? [{ path: "tag" }] : [])
      ]);

    return foundAchievement;
  } catch (err) {
    logger.error(`Error occured while getting achievement. ${err}`);
    handleAppError(err);
  }
};

export const updateOneAchievement = async (
  filter: FilterQuery<AchievementDocument>,
  updateData: UpdateQuery<AchievementUpdateData>
) => {
  try {
    const updatedAchievement = await Achievement.findOneAndUpdate(filter, updateData, { new: true });

    const achievement = checkExistResource(updatedAchievement, "Achievement");

    return achievement;
  } catch (err) {
    logger.error(`Error occured while updating achievement with (${JSON.stringify(filter)}). ${err}`);
    handleAppError(err);
  }
};

export const createCustomAchievement = async (createData: CustomAchievementCreateData) => {
  try {
    //handling for ACTION custom data
    const { custom } = createData;
    handleCustomAchievementActionData(custom);

    const createdAchievementStage = await Achievement.create({
      ...createData,
      isTime: custom.action === CustomAchievementAction.WATCH_TIME ? true : false
    });

    if (!createdAchievementStage) {
      throw new AppError(400, "Couldn't create new custom achievement");
    }
    return createdAchievementStage;
  } catch (err) {
    logger.error(`Error occured in createCustomAchievement: ${err}`);
    handleAppError(err);
  }
};

const handleCustomAchievementActionData = (customProperty: AchievementCustomModel) => {
  switch (customProperty.action) {
    case CustomAchievementAction.INCLUDES:
    case CustomAchievementAction.STARTS_WITH:
    case CustomAchievementAction.ENDS_WITH:
      if (
        (customProperty.stringValues && customProperty.stringValues?.length <= 0) ||
        !customProperty.stringValues?.at(0)
      )
        throw new AppError(
          400,
          `With ${CustomAchievementAction.INCLUDES}, ${CustomAchievementAction.STARTS_WITH} or ${CustomAchievementAction.ENDS_WITH} stringValues need have at least one item`
        );
      return;
    case CustomAchievementAction.MESSAGE_GT:
    case CustomAchievementAction.MESSAGE_LT:
      if (!customProperty.numberValue)
        throw new AppError(
          400,
          `With ${CustomAchievementAction.MESSAGE_GT} or ${CustomAchievementAction.MESSAGE_LT} numberValue need to be a number`
        );
      return;
  }
};

export const deleteOneAchievement = async (filter: FilterQuery<AchievementDocument>) => {
  try {
    const deletedAchievement = await Achievement.findOneAndDelete(filter);

    checkExistResource(deletedAchievement, "Achievement");
    return { message: "Successfully removed achievement" };
  } catch (err) {
    logger.error(`Error occured while deleteOneAchievement: ${err}`);
    handleAppError(err);
  }
};

export const deleteCustomAchievementById = async (id: string) => {
  try {
    await deleteOneAchievement({ _id: id, custom: { $exists: true } });
    return { message: "Successfully removed custom achievement" };
  } catch (err) {
    logger.error(`Error occured while deleting badge by id(${id}). ${err}`);
    handleAppError(err);
  }
};
