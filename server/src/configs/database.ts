import {
  configExist,
  createNewConfig,
  createChatCommand,
  getChatCommandsCount,
  createTag,
  getOneTag,
  getTagsCount,
  createMood,
  getMoodsCount,
  getOneMood,
  getAchievementsCount,
  createBadge,
  getAchievementStagesCount,
  createAchievementStage,
  createAchievement
} from "@services";
import mongoose, { ConnectOptions } from "mongoose";
import {
  getDefaultAchievementStagesData,
  getDefaultAchievementsData,
  getDefaultBadgeData,
  getDefaultChatCommands,
  getDefaultMood,
  getDefaultTag
} from "@defaults";
import { databaseConnectURL } from "./envVariables";

export const initMongoDataBase = async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(databaseConnectURL, {
      useNewUrlParser: true
    } as ConnectOptions);
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }

  await createDefaultConfigs();

  await Promise.all([createDefaultTag(), createDefaultMood()]);

  const [tag, mood] = await Promise.all([getOneTag({}), getOneMood({})]);
  if (tag) {
    if (mood) {
      await createDefaultCommands(tag.id, mood.id);
    }

    await createDefaultInitialAchievements(tag.id);
  }
};

const createDefaultConfigs = async () => {
  if (!(await configExist())) await createNewConfig();
};

const createDefaultCommands = async (tagId: string, moodId: string) => {
  if ((await getChatCommandsCount()) === 0) {
    const chatCommands = getDefaultChatCommands();
    const chatCommandsWithModes = chatCommands.map((command) => {
      return {
        ...command,
        tag: tagId,
        mood: moodId
      };
    });
    await createChatCommand(chatCommandsWithModes);
  }
};
const createDefaultTag = async () => {
  if ((await getTagsCount()) === 0) {
    const tags = getDefaultTag();
    await createTag(tags);
  }
};

const createDefaultMood = async () => {
  if ((await getMoodsCount()) === 0) {
    const moods = getDefaultMood();
    await createMood(moods);
  }
};

const createDefaultAchievementStages = async (badgeId: string) => {
  if ((await getAchievementStagesCount()) === 0) {
    return await createAchievementStage(getDefaultAchievementStagesData(badgeId));
  }
};

const createDefaultAchievements = async (stagesId: string, tagId: string) => {
  const achievementsData = getDefaultAchievementsData(stagesId, tagId);

  achievementsData.forEach((data) => createAchievement(data));
};

const createDefaultInitialAchievements = async (tagId: string) => {
  if ((await getAchievementsCount()) !== 0) return;
  const badge = await createBadge(getDefaultBadgeData());
  if (!badge) return;
  const stages = await createDefaultAchievementStages(badge._id);
  if (!stages) return;
  await createDefaultAchievements(stages._id, tagId);
};
