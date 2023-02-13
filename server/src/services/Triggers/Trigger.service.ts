import { Trigger } from "@models/trigger.model";
import { ITriggerDocument } from "@models/types";
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

  const trigger = await Trigger.find(filter)
    .limit(limit * 1)
    .skip((skip - 1) * limit)
    .select(select)
    .sort(sort);

  return trigger;
};

export const getTriggersCount = async (
  filter: FilterQuery<ITriggerDocument> = {}
) => {
  return await Trigger.countDocuments(filter);
};

export const createTrigger = async (createData: TriggerCreateData) => {
  try {
    const trigger = await Trigger.create(createData);
    return trigger;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create trigger");
  }
};

export const updateTriggerById = async (
  id: string,
  updateData: UpdateQuery<TriggerUpdateData>
) => {
  try {
    const trigger = await Trigger.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return trigger;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update trigger");
  }
};

export const deleteTriggerById = async (id: string) => {
  try {
    return await Trigger.findByIdAndDelete(id);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to delete trigger");
  }
};
