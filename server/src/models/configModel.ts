import { Model, model, Schema } from "mongoose";
import { IConfigDocument } from "./types";
import { configDefaults } from "../defaults/configsDefaults";
const {
  commandsPrefix,
  timersIntervalDelay,
  activeUserTimeDelay,
  chatGamesIntervalDelay,
  minActiveUsersThreshold,
  pointsIncrement,
  intervalCheckChatters,
  intervalCheckViewersPeek,
  permissionLevels,
} = configDefaults;

const ConfigSchema: Schema<IConfigDocument> = new Schema(
  {
    commandsPrefix: { type: String, required: true, default: commandsPrefix },
    timersIntervalDelay: {
      type: Number,
      required: true,
      default: timersIntervalDelay,
    },
    activeUserTimeDelay: {
      type: Number,
      required: true,
      default: activeUserTimeDelay,
    },
    chatGamesIntervalDelay: {
      type: Number,
      required: true,
      default: chatGamesIntervalDelay,
    },
    minActiveUsersThreshold: {
      type: Number,
      required: true,
      default: minActiveUsersThreshold,
    },
    intervalCheckChatters: {
      type: Number,
      required: true,
      default: intervalCheckChatters,
    },
    pointsIncrement: {
      message: { type: Number, default: pointsIncrement.message },
      watch: { type: Number, default: pointsIncrement.watch },
      watchMultipler: { type: Number, default: pointsIncrement.watchMultipler },
    },
    intervalCheckViewersPeek: {
      type: Number,
      required: true,
      default: intervalCheckViewersPeek,
    },
    permissionLevels: {
      broadcaster: { type: Number, default: permissionLevels.broadcaster },
      mod: { type: Number, default: permissionLevels.mod },
      vip: { type: Number, default: permissionLevels.vip },
      all: { type: Number, default: permissionLevels.all },
    },
  },
  {
    capped: { size: 100000, max: 1 },
    timestamps: true,
  }
);

export const Config: Model<IConfigDocument> = model("Configs", ConfigSchema);
