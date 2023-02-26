import { Trigger } from "@models/trigger.model";
import { ITriggerDocument } from "@models/types";
import { checkExistResource } from "@utils/checkExistResource.util";
import { AppError, handleAppError } from "@utils/ErrorHandler.util";
import { logger } from "@utils/logger.util";
import { FilterQuery, UpdateQuery } from "mongoose";
import {
  ManyTriggersFindOptions,
  TriggerCreateData,
  TriggerUpdateData,
} from "./types/Trigger";

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
