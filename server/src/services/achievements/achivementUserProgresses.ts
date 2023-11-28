import {
  AchievementUserProgressDocument,
  AchievementUserProgress,
  AchievementModel,
  AchievementUserProgressModel,
  TagModel,
  StageData,
  BadgeModel
} from "@models";
import { logger, handleAppError, checkExistResource } from "@utils";
import { FilterQuery, UpdateQuery } from "mongoose";
import { getOneAchievement, getUserById } from "@services";
import {
  AchievementUserProgressCreate,
  AchievementUserProgressUpdate,
  AchievementUserProgressesFindOptions,
  GainedProgress,
  GetDataForObtainAchievementEmitReturnData,
  UpdateAchievementUserProgressProgressesArgs,
  UpdateAchievementUserProgressProgressesReturnData,
  UpdateFinishedStagesDependsOnProgressReturnData
} from "./types";

export const getAchievementUserProgresses = async (
  filter: FilterQuery<AchievementUserProgressDocument> = {},
  findOptions: AchievementUserProgressesFindOptions
) => {
  const { select = { __v: 0 }, populate } = findOptions;
  try {
    const achievementUserProgress = await AchievementUserProgress.find(filter)
      .select(select)
      .populate([
        ...(populate?.achievements?.value
          ? [
              {
                path: "achievement",
                ...(populate.achievements.stages?.value && {
                  populate: {
                    path: "stages",
                    ...(populate.achievements.stages.badges && {
                      populate: { path: "stageData.badge" }
                    })
                  }
                })
              }
            ]
          : [])
      ]);
    return achievementUserProgress;
  } catch (err) {
    logger.error(`Error occured in getAchievementUserProgresses. ${err}`);
    handleAppError(err);
  }
};
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
    const foundAchievement = await AchievementUserProgress.findOne(filter);

    const achievement = checkExistResource(foundAchievement, "Achievement user progress");
    const updatedAchievement = await AchievementUserProgress.findByIdAndUpdate(
      foundAchievement?._id,
      {
        ...updateData,
        ...(updateData.progresses && {
          $set: { progressesLength: achievement.progresses.length || updateData.progresses.length }
        })
      },
      {
        new: true
      }
    );

    return updatedAchievement;
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
  { stages: { stageData }, showProgress }: AchievementModel,
  { _id: progressId, progresses }: AchievementUserProgressModel,
  progress: number
): Promise<UpdateFinishedStagesDependsOnProgressReturnData> => {
  const returnData: UpdateFinishedStagesDependsOnProgressReturnData = {
    nowFinishedStages: [],
    gainedProgress: null
  };
  const stageDataLen = stageData.length;
  for (let idx = 0; idx < stageDataLen; idx++) {
    const currentAchievementStage = stageData[idx];
    const currentProgressStage = progresses.at(idx);
    if (!currentProgressStage && currentAchievementStage.goal <= progress) {
      returnData.nowFinishedStages.push([currentAchievementStage.stage, Date.now()]);
      // ------
    } else if (showProgress && (progress < currentAchievementStage.goal || idx === stageDataLen - 1)) {
      const currentStageIndex = idx - 1;
      const currentStageNumber = currentStageIndex >= 0 ? stageData.at(currentStageIndex)?.stage || null : null;
      returnData.gainedProgress = {
        currentStageNumber: currentStageNumber,
        nextStageNumber: currentAchievementStage.stage,
        progress
      };
      break;
    }
  }

  await updateOneAchievementUserProgress(
    { _id: progressId },
    { progresses: [...progresses, ...returnData.nowFinishedStages], value: progress }
  );
  return returnData;
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

  const { nowFinishedStages, gainedProgress } = await updateFinishedStagesDependsOnProgress(
    foundAchievement,
    userProgress,
    progress.increment ? userProgress.value + progress.value : progress.value
  );

  return { foundAchievement, nowFinishedStages, gainedProgress };
};

const getGainedProgressReturnData = (gainedProgress: GainedProgress, stageData: StageData<BadgeModel>[]) => {
  const currentStageProgressGained = stageData.find(({ stage }) => stage === gainedProgress.currentStageNumber);
  const nextStageProgressGained = stageData.find(({ stage }) => stage === gainedProgress.nextStageNumber);

  const gainedProgressReturnData: GetDataForObtainAchievementEmitReturnData["gainedProgress"] = {
    currentStage: currentStageProgressGained,
    nextStage: nextStageProgressGained,
    progress: gainedProgress.progress,
    timestamp: Date.now()
  };

  return gainedProgressReturnData;
};

export const getDataForObtainAchievementEmit = (
  data: UpdateAchievementUserProgressProgressesReturnData
): GetDataForObtainAchievementEmitReturnData => {
  const newStages: GetDataForObtainAchievementEmitReturnData["stages"] = [];

  const { nowFinishedStages, foundAchievement, gainedProgress } = data;
  const {
    stages: { stageData }
  } = foundAchievement;

  nowFinishedStages.forEach((stage) => {
    const data = stageData.find((innerStage) => innerStage.stage === stage[0]);
    if (!data) return;

    newStages.push({
      data,
      timestamp: stage[1]
    });
  });

  const gainedProgressReturnData = gainedProgress ? getGainedProgressReturnData(gainedProgress, stageData) : null;

  return {
    achievement: {
      name: foundAchievement.name,
      isTime: foundAchievement.isTime
    },
    stages: newStages,
    gainedProgress: gainedProgressReturnData
  };
};
