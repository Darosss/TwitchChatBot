import { configExist, createNewConfig } from "@services/Configs";
import mongoose, { ConnectOptions } from "mongoose";
import { createChatCommand, getChatCommandsCount } from "@services/ChatCommand";

const initMongoDataBase = async () => {
  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(
      process.env.DB_CONN_STRING as string,
      { useNewUrlParser: true } as ConnectOptions
    );
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }

  await createDefaultConfigs();
  await createDefaultCommands();
};

const createDefaultConfigs = async () => {
  if (!(await configExist())) await createNewConfig();
};

const createDefaultCommands = async () => {
  if ((await getChatCommandsCount()) === 0) {
    const defaultCommands = [
      {
        name: "messages",
        messages: ["@{username}, your messages: {messageCount}"],
        aliases: ["messages", "msgs", "msg"],
        description: "Send information about user's message count",
      },
      {
        name: "points",
        messages: ["@{username}, your points: {points}"],
        aliases: ["pts", "points"],
        description: "Send information about user's points",
      },
      {
        name: "example",
        messages: [
          "This is example command message 1",
          "This is example command message 2",
        ],
        aliases: ["example", "exampleCommand"],
        description: "Example command description",
      },
    ];
    await createChatCommand(defaultCommands);
  }
};

export default initMongoDataBase;