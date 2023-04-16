import { configExist, createNewConfig } from "@services/configs";
import mongoose, { ConnectOptions } from "mongoose";
import {
  createChatCommand,
  getChatCommandsCount,
} from "@services/chatCommands";
import { getDefaultChatCommands } from "@defaults/commandsDefaults";
import { createTag, getOneTag, getTagsCount } from "@services/tags";
import {
  getDefaultMood,
  getDefaultPersonality,
  getDefaultTag,
} from "@defaults/modesDefaults";
import { createMood, getMoodsCount, getOneMood } from "@services/moods";
import {
  createPersonality,
  getOnePersonality,
  getPersonalitiesCount,
} from "@services/personalities";
import { databaseConnectURL } from "./envVariables";
const initMongoDataBase = async () => {
  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(databaseConnectURL, {
      useNewUrlParser: true,
    } as ConnectOptions);
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }

  await createDefaultConfigs();

  const modesPromise = await Promise.all([
    createDefaultTag(),
    createDefaultMood(),
    createDefaultPersonality(),
  ]);

  await createDefaultCommands();
};

const createDefaultConfigs = async () => {
  if (!(await configExist())) await createNewConfig();
};

const createDefaultCommands = async () => {
  if ((await getChatCommandsCount()) === 0) {
    const modes = await Promise.all([
      getOneTag({}),
      getOneMood({}),
      getOnePersonality({}),
    ]);

    const [tag, mood, personality] = modes;
    if (tag && mood && personality) {
      const chatCommands = getDefaultChatCommands();
      const chatCommandsWithModes = chatCommands.map((command) => {
        return {
          ...command,
          tag: tag.id,
          mood: mood.id,
          personality: personality.id,
        };
      });
      await createChatCommand(chatCommandsWithModes);
    }
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

const createDefaultPersonality = async () => {
  if ((await getPersonalitiesCount()) === 0) {
    const personalities = getDefaultPersonality();
    await createPersonality(personalities);
  }
};

export default initMongoDataBase;
