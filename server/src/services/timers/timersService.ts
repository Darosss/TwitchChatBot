import { modesPipeline } from "@aggregations/modesPipeline";
import { Timer } from "@models/timerModel";
import { TimerDocument, TimerModel } from "@models/types";
import { checkExistResource } from "@utils/checkExistResourceUtil";
import { AppError, handleAppError } from "@utils/ErrorHandlerUtil";
import { logger } from "@utils/loggerUtil";
import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { ManyTimersFindOptions, TimerCreateData, TimerFindOptions, TimerUpdateData } from "./types";

export const getTimers = async (filter: FilterQuery<TimerDocument> = {}, timerFindOptions: ManyTimersFindOptions) => {
  const { limit = 50, skip = 1, sort = { createdAt: -1 }, select = { __v: 0 }, populateSelect } = timerFindOptions;

  try {
    const timer = await Timer.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .populate(populateSelect)
      .sort(sort);

    return timer;
  } catch (err) {
    logger.error(`Error occured while getting timers. ${err}`);
    handleAppError(err);
  }
};

export const getTimersCount = async (filter: FilterQuery<TimerDocument> = {}) => {
  return await Timer.countDocuments(filter);
};

export const createTimer = async (createData: TimerCreateData | TimerCreateData[]) => {
  try {
    const createdTimer = await Timer.create(createData);

    if (!createdTimer) {
      throw new AppError(400, "Couldn't create new timer(s");
    }
    return createdTimer;
  } catch (err) {
    logger.error(`Error occured while creating timer(s). ${err}`);
    handleAppError(err);
  }
};

export const updateTimers = async (
  filter: FilterQuery<TimerDocument> = {},
  updateData: UpdateQuery<TimerUpdateData>
) => {
  try {
    const updatedTimers = await Timer.updateMany(filter, updateData, {
      new: true
    });

    return updatedTimers;
  } catch (err) {
    logger.error(`Error occured while updating many timers. ${err}`);
    handleAppError(err);
  }
};

export const updateEnabledTimersAndEnabledModes = async (
  pointsInrement: number,
  matchOption?: FilterQuery<TimerDocument>
) => {
  try {
    const pipeline: PipelineStage[] = [
      ...modesPipeline,
      { $match: { enabled: true, ...matchOption } },
      { $set: { points: { $add: ["$points", pointsInrement] } } },
      { $unset: ["tag_info", "mood_info"] },
      { $merge: { into: "timers", on: "_id", whenMatched: "replace" } }
    ];

    const timers = await Timer.aggregate(pipeline);

    return timers;
  } catch (err) {
    logger.error(`Error occured while aggregating timers for update by enabled and enabled modes: ${err}`);
    handleAppError(err);
  }
};

export const updateTimerById = async (id: string, updateData: UpdateQuery<TimerUpdateData>) => {
  try {
    const updatedTimer = await Timer.findByIdAndUpdate(id, updateData, {
      new: true
    });

    const timer = checkExistResource(updatedTimer, `Timer with id(${id})`);

    return timer;
  } catch (err) {
    logger.error(`Error occured while editing timer by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const deleteTimerById = async (id: string) => {
  try {
    const deletedTimer = await Timer.findByIdAndDelete(id);

    const timer = checkExistResource(deletedTimer, `Timer with id(${id})`);

    return timer;
  } catch (err) {
    logger.error(`Error occured while deleting timer by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const getTimerById = async (
  id: string,
  filter: FilterQuery<TimerDocument> = {},
  timerFindOptions: TimerFindOptions
) => {
  const { select = { __v: 0 }, populateSelect } = timerFindOptions;
  try {
    const foundTimer = await Timer.findById(id, filter).select(select).populate(populateSelect);

    const timer = checkExistResource(foundTimer, `Timer with id(${id})`);

    return timer;
  } catch (err) {
    logger.error(`Error occured while getting timer: ${err}`);
    handleAppError(err);
  }
};

export const getOneTimer = async (filter: FilterQuery<TimerDocument> = {}) => {
  try {
    const foundTimer = await Timer.findOne(filter);

    const timer = checkExistResource(foundTimer, "Timer");

    return timer;
  } catch (err) {
    logger.error(`Error occured while getting timer: ${err}`);
    handleAppError(err);
  }
};

export const getTimersDataWithModesEnabled = async (): Promise<undefined | TimerModel[]> => {
  try {
    const pipeline: PipelineStage[] = [
      { $match: { enabled: true } },
      ...modesPipeline,
      {
        $project: {
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
          tag_info: 0,
          mood_info: 0
        }
      }
    ];

    const timers = await Timer.aggregate<TimerModel>(pipeline);
    if (timers.length > 0) {
      return timers;
    }

    return;
  } catch (err) {
    logger.error(`Error occured while aggregating timers data: ${err}`);
    handleAppError(err);
  }
};
