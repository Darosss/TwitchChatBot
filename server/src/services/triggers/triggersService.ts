import { Trigger } from "@models/triggerModel";
import { ITriggerDocument } from "@models/types";
import { checkExistResource } from "@utils/checkExistResourceUtil";
import { AppError, handleAppError } from "@utils/ErrorHandlerUtil";
import { logger } from "@utils/loggerUtil";
import { FilterQuery, UpdateQuery } from "mongoose";
import {
  ManyTriggersFindOptions,
  TriggerCreateData,
  TriggerUpdateData,
} from "./types";

export const getTriggers = async (
  filter: FilterQuery<ITriggerDocument> = {},
  triggerFindOptions: ManyTriggersFindOptions
) => {
  const {
    limit = 50,
    skip = 1,
    sort = { createdAt: -1 },
    select = { __v: 0 },
  } = triggerFindOptions;

  try {
    const trigger = await Trigger.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .sort(sort);

    return trigger;
  } catch (err) {
    logger.error(`Error occured while getting triggers. ${err}`);
    handleAppError(err);
  }
};

export const getTriggersCount = async (
  filter: FilterQuery<ITriggerDocument> = {}
) => {
  return await Trigger.countDocuments(filter);
};

export const createTrigger = async (
  createData: TriggerCreateData | TriggerCreateData[]
) => {
  try {
    const createdTrigger = await Trigger.create(createData);

    if (!createdTrigger) {
      throw new AppError(400, "Couldn't create new trigger(s");
    }
    return createdTrigger;
  } catch (err) {
    logger.error(`Error occured while creating trigger(s). ${err}`);
    handleAppError(err);
  }
};

export const updateTriggers = async (
  filter: FilterQuery<ITriggerDocument> = {},
  updateData: UpdateQuery<TriggerUpdateData>
) => {
  try {
    await Trigger.updateMany(filter, updateData, {
      new: true,
    });
  } catch (err) {
    logger.error(`Error occured while updating many triggers. ${err}`);
    handleAppError(err);
  }
};

export const updateTriggerById = async (
  id: string,
  updateData: UpdateQuery<TriggerUpdateData>
) => {
  try {
    const updatedTrigger = await Trigger.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    const trigger = checkExistResource(
      updatedTrigger,
      `Trigger with id(${id})`
    );

    return trigger;
  } catch (err) {
    logger.error(`Error occured while editing trigger by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const deleteTriggerById = async (id: string) => {
  try {
    const deletedTrigger = await Trigger.findByIdAndDelete(id);

    const trigger = checkExistResource(
      deletedTrigger,
      `Trigger with id(${id})`
    );

    return trigger;
  } catch (err) {
    logger.error(`Error occured while deleting trigger by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const getTriggerById = async (
  id: string,
  filter: FilterQuery<ITriggerDocument> = {}
) => {
  try {
    const foundTrigger = await Trigger.findById(id, filter);

    const trigger = checkExistResource(foundTrigger, `Trigger with id(${id})`);

    return trigger;
  } catch (err) {
    logger.error(`Error occured while getting trigger: ${err}`);
    handleAppError(err);
  }
};

export const getOneTrigger = async (
  filter: FilterQuery<ITriggerDocument> = {}
) => {
  try {
    const foundTrigger = await Trigger.findOne(filter);

    const trigger = checkExistResource(foundTrigger, "Trigger");

    return trigger;
  } catch (err) {
    logger.error(`Error occured while getting trigger: ${err}`);
    handleAppError(err);
  }
};

export const getTriggersWords = async (): Promise<undefined | string[]> => {
  try {
    const triggerWords = await Trigger.aggregate([
      {
        $group: {
          _id: null,
          words: { $push: "$words" },
        },
      },
      {
        $project: {
          words: {
            $reduce: {
              input: "$words",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
          _id: 0,
        },
      },
      {
        $unwind: "$words",
      },
      {
        $addFields: {
          wordsLower: { $toLower: "$words" },
        },
      },
      {
        $sort: {
          wordsLower: 1,
        },
      },
      {
        $group: {
          _id: null,
          words: { $push: "$wordsLower" },
        },
      },
      {
        $project: {
          _id: 0,
          words: 1,
        },
      },
    ]);
    if (triggerWords.length > 0) {
      const words: string[] = triggerWords[0].words;
      return words.sort((a, b) => b.length - a.length);
    }

    return [];
  } catch (err) {
    logger.error(
      `Error occured while aggregating chat commands for all aliases words: ${err}`
    );
    handleAppError(err);
  }
};
