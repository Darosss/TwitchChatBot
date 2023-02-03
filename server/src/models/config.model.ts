import { Model, model, Schema } from "mongoose";
import { IConfigDocument } from "./types";

const ConfigSchema: Schema<IConfigDocument> = new Schema(
  {
    commandsPrefix: { type: String, required: true, default: "--" },
    timersIntervalDelay: { type: Number, required: true, default: 20 },
    activeUserTimeDelay: { type: Number, required: true, default: 150 },
    chatGamesIntervalDelay: { type: Number, required: true, default: 20 },
    minActiveUsersThreshold: { type: Number, required: true, default: 3 },
    permissionLevels: {
      broadcaster: { type: Number, default: 10 },
      mod: { type: Number, default: 8 },
      vip: { type: Number, default: 4 },
      all: { type: Number, default: 0 },
    },
  },
  {
    capped: { size: 100000, max: 1 },
  }
);

export const Config: Model<IConfigDocument> = model("Configs", ConfigSchema);
