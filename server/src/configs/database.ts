import { configExist, createNewConfig } from "@services/configs";
import mongoose, { ConnectOptions } from "mongoose";
import {
  createChatCommand,
  getChatCommandsCount,
} from "@services/chatCommands";
import { getDefaultChatCommands } from "@defaults/commandsDefaults";
import { createTag, getOneTag, getTagsCount } from "@services/tags";
import { getDefaultMood, getDefaultTag } from "@defaults/modesDefaults";
import { createMood, getMoodsCount, getOneMood } from "@services/moods";

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
  ]);

  await createDefaultCommands();
};

const createDefaultConfigs = async () => {
  if (!(await configExist())) await createNewConfig();
};

const createDefaultCommands = async () => {
  if ((await getChatCommandsCount()) === 0) {
    const modes = await Promise.all([getOneTag({}), getOneMood({})]);

    const [tag, mood] = modes;
    if (tag && mood) {
      const chatCommands = getDefaultChatCommands();
      const chatCommandsWithModes = chatCommands.map((command) => {
        return {
          ...command,
          tag: tag.id,
          mood: mood.id,
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

export default initMongoDataBase;
