import {
  AchievementUserProgressDocument,
  AchievementUserProgress,
  AchievementModel,
  AchievementUserProgressModel
} from "@models";
import { logger, handleAppError, checkExistResource } from "@utils";
import { FilterQuery, UpdateQuery } from "mongoose";
import { getUserById } from "@services";
import { AchievementUserProgressCreate, AchievementUserProgressUpdate } from "./types";

export const getOneAchievementUserProgress = async (filter: FilterQuery<AchievementUserProgressDocument> = {}) => {
  try {
    const achievementUserProgress = await AchievementUserProgress.findOne(filter);

    return achievementUserProgress;
  } catch (err) {
    logger.error(`Error occured while getting achievement. ${err}`);
    handleAppError(err);
  }
};

export const createAchievementUserProgress = async (createData: AchievementUserProgressCreate) => {
  try {
    const foundProgress = await getOneAchievementUserProgress({
      achievement: createData.achievement,
      userId: createData.userId
    });

    if (foundProgress) return foundProgress;

    const createdAchievementUserProgress = await AchievementUserProgress.create(createData);

    return createdAchievementUserProgress;
  } catch (err) {
    logger.error(`Error occured while creating createAchievementUserProgress. ${err}`);
    handleAppError(err);
  }
};

export const updateOneAchievementUserProgress = async (
  filter: FilterQuery<AchievementUserProgressDocument>,
  updateData: UpdateQuery<AchievementUserProgressUpdate>
) => {
  try {
    const updatedAchievement = await AchievementUserProgress.findOneAndUpdate(filter, updateData, {
      new: true
    });

    const achievement = checkExistResource(updatedAchievement, "Achievement user progress");

    return achievement;
  } catch (err) {
    logger.error(
      `Error occured while updateOneAchievementUserProgress with filter: (${JSON.stringify(filter)}). ${err}`
    );
    handleAppError(err);
  }
};

export const getAchievementsProgressesByUserId = async (userId: string) => {
  try {
    const foundUser = await getUserById(userId, {});
    if (!foundUser) return;
    const achievementProgresses = await AchievementUserProgress.find({ userId: foundUser.id }).populate({
      path: "achievement",
      populate: {
        path: "stages",
        populate: {
          path: "stageData.badge"
        }
      }
    });

    return achievementProgresses;
  } catch (err) {
    logger.error(`Error occured in getAchievementsProgressesByUserId, ${err}`);
    handleAppError(err);
  }
};

export const updateFinishedStagesDependsOnProgress = async (
  achievement: AchievementModel,
  achievementProgress: AchievementUserProgressModel,
  progress: number
) => {
  const modifiedStages: AchievementUserProgressModel["progresses"] = achievementProgress.progresses;

  for (let idx = 0; idx < achievement.stages.stageData.length; idx++) {
    const currentAchievementStage = achievement.stages.stageData[idx];
    const currentProgressStage = achievementProgress.progresses.at(idx);
    if (!currentProgressStage && currentAchievementStage.goal <= progress) {
      modifiedStages.push([currentAchievementStage.stage, Date.now()]);
    }
  }

  const updatedAchievementUpdate = await updateOneAchievementUserProgress(
    { _id: achievementProgress._id },
    { progresses: modifiedStages, value: progress }
  );

  return updatedAchievementUpdate;
};