import {
  AchievementUserProgressDocument,
  AchievementUserProgress,
  AchievementModel,
  AchievementUserProgressModel,
  TagModel
} from "@models";
import { logger, handleAppError, checkExistResource } from "@utils";
import { FilterQuery, UpdateQuery } from "mongoose";
import { getOneAchievement, getUserById } from "@services";
import {
  AchievementUserProgressCreate,
  AchievementUserProgressUpdate,
  GetDataForObtainAchievementEmitReturnData,
  UpdateAchievementUserProgressProgressesArgs,
  UpdateAchievementUserProgressProgressesReturnData
} from "./types";

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
): Promise<[number, number][]> => {
  const newfinishedStages: AchievementUserProgressModel["progresses"] = [];
  for (let idx = 0; idx < achievement.stages.stageData.length; idx++) {
    const currentAchievementStage = achievement.stages.stageData[idx];
    const currentProgressStage = achievementProgress.progresses.at(idx);
    if (!currentProgressStage && currentAchievementStage.goal <= progress) {
      newfinishedStages.push([currentAchievementStage.stage, Date.now()]);
    }
  }

  await updateOneAchievementUserProgress(
    { _id: achievementProgress._id },
    { progresses: [...achievementProgress.progresses, ...newfinishedStages], value: progress }
  );

  return newfinishedStages;
};

export const updateAchievementUserProgressProgresses = async ({
  achievementName,
  userId,
  progress
}: UpdateAchievementUserProgressProgressesArgs): Promise<
  UpdateAchievementUserProgressProgressesReturnData | undefined
> => {
  const foundAchievement = await getOneAchievement({ name: achievementName }, {}, true);

  //FIXME:                                          Fix this assertion
  //TODO: refactor this - most of these logic should go into AchievementsHandler - dunno.
  if (!foundAchievement || !(foundAchievement.tag as TagModel).enabled || !foundAchievement.enabled) return; //TODO: add handling
  const userProgress = await createAchievementUserProgress({
    userId: userId,
    achievement: foundAchievement._id
  });

  if (!userProgress) return; //TODO: add handling

  const nowFinishedStages = await updateFinishedStagesDependsOnProgress(
    foundAchievement,
    userProgress,
    progress.increment ? userProgress.value + progress.value : progress.value
  );

  return { foundAchievement, nowFinishedStages };
};

export const getDataForObtainAchievementEmit = (
  data: UpdateAchievementUserProgressProgressesReturnData
): GetDataForObtainAchievementEmitReturnData => {
  const newStages: GetDataForObtainAchievementEmitReturnData["stages"] = [];

  data.nowFinishedStages.forEach((stage) => {
    const stageData = data.foundAchievement.stages.stageData.find((innerStage) => innerStage.stage === stage[0]);
    if (stageData) newStages.push([stageData, stage[1]]);
  });
  return {
    achievementName: data.foundAchievement.name,
    stages: newStages
  };
};
