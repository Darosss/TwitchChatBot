import { Config } from "./models/config.model";
import mongoose, { ConnectOptions } from "mongoose";
import { ChatCommand } from "./models/chat-command.model";

const initMongoDataBase = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(
    process.env.DB_CONN_STRING as string,
    { useNewUrlParser: true } as ConnectOptions
  );
};

export const initDefaultsDB = async () => {
  if ((await Config.countDocuments()) === 0) await new Config().save();
  //If Config does not exist create new with default values
  defaultCommands();
};

const defaultCommands = async () => {
  if ((await ChatCommand.countDocuments()) === 0) {
    await new ChatCommand({
      name: "messages",
      messages: ["@{username}, your messages: {messageCount}"],
      aliases: ["messages", "msgs", "msg"],
    }).save();

    await new ChatCommand({
      name: "points",
      messages: ["@{username}, your points: {points}"],
      aliases: ["pts", "points"],
    }).save();

    await new ChatCommand({
      name: "example",
      messages: [
        "This is example command message 1",
        "This is example command message 2",
      ],
      aliases: ["example", "exampleCommand"],
    }).save();
  }
};

export default initMongoDataBase;
