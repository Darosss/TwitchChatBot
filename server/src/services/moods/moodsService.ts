import { Mood } from "@models/moodModel";
import { MoodDocument } from "@models/types";
import { getChatCommandsCount } from "@services/chatCommands";
import { getMessageCategoriesCount } from "@services/messageCategories";
import { getTimersCount } from "@services/timers";
import { getTriggersCount } from "@services/triggers";
import { checkExistResource } from "@utils/checkExistResourceUtil";
import { AppError, handleAppError } from "@utils/ErrorHandlerUtil";
import { logger } from "@utils/loggerUtil";
import { FilterQuery, UpdateQuery } from "mongoose";
import { ManyMoodsFindOptions, MoodCreateData, MoodUpdateData } from "./types";

export const getMoods = async (
  filter: FilterQuery<MoodDocument> = {},
  moodFindOptions: ManyMoodsFindOptions
) => {
  const {
    limit = 50,
    skip = 1,
    sort = { createdAt: -1 },
    select = { __v: 0 },
  } = moodFindOptions;

  try {
    const mood = await Mood.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .sort(sort);

    return mood;
  } catch (err) {
    logger.error(`Error occured while getting moods. ${err}`);
    handleAppError(err);
  }
};

export const getMoodsCount = async (filter: FilterQuery<MoodDocument> = {}) => {
  return await Mood.countDocuments(filter);
};

export const createMood = async (
  createData: MoodCreateData | MoodCreateData[]
) => {
  try {
    const createdMood = await Mood.create(createData);

    if (!createdMood) {
      throw new AppError(400, "Couldn't create new mood(s");
    }
    return createdMood;
  } catch (err) {
    logger.error(`Error occured while creating mood(s). ${err}`);
    handleAppError(err);
  }
};

export const updateMoods = async (
  filter: FilterQuery<MoodDocument> = {},
  updateData: UpdateQuery<MoodUpdateData>
) => {
  try {
    await Mood.updateMany(filter, updateData, {
      new: true,
    });
  } catch (err) {
    logger.error(`Error occured while updating many moods. ${err}`);
    handleAppError(err);
  }
};

export const updateMoodById = async (
  id: string,
  updateData: UpdateQuery<MoodUpdateData>
) => {
  try {
    const updatedMood = await Mood.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    const mood = checkExistResource(updatedMood, `Mood with id(${id})`);

    return mood;
  } catch (err) {
    logger.error(`Error occured while editing mood by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const deleteMoodById = async (id: string) => {
  try {
    const filter = { mood: id };
    const countMoodsInDocs = await Promise.all([
      getTriggersCount(filter),
      getChatCommandsCount(filter),
      getTimersCount(filter),
      getMessageCategoriesCount(filter),
    ]);

    if (countMoodsInDocs.reduce((a, b) => a + b) > 0) {
      throw new AppError(
        409,
        `Mood with id(${id}) is used somewhere else, cannot delete`
      );
    }
    const deletedMood = await Mood.findByIdAndDelete(id);

    const mood = checkExistResource(deletedMood, `Mood with id(${id})`);

    return mood;
  } catch (err) {
    logger.error(`Error occured while deleting mood by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const getMoodById = async (
  id: string,
  filter: FilterQuery<MoodDocument> = {}
) => {
  try {
    const foundMood = await Mood.findById(id, filter);

    const mood = checkExistResource(foundMood, `Mood with id(${id})`);

    return mood;
  } catch (err) {
    logger.error(`Error occured while getting mood: ${err}`);
    handleAppError(err);
  }
};

export const getOneMood = async (filter: FilterQuery<MoodDocument> = {}) => {
  try {
    const foundMood = await Mood.findOne(filter);

    const mood = checkExistResource(foundMood, "Mood");

    return mood;
  } catch (err) {
    logger.error(`Error occured while getting mood: ${err}`);
    handleAppError(err);
  }
};
