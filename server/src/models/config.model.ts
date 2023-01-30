import { Model, model, Schema } from "mongoose";
import { IConfigDocument } from "./types";

const ConfigSchema: Schema<IConfigDocument> = new Schema({
  commandsPrefix: { type: String, required: true, default: "--" },
  timersIntervalDelay: { type: Number, required: true, default: 20 },
  activeUserTimeDelay: { type: Number, required: true, default: 150 },
  chatGamesIntervalDelay: { type: Number, required: true, default: 20 },
  minActiveUsersThreshold: { type: Number, required: true, default: 3 },
});

export const Config: Model<IConfigDocument> = model("Configs", ConfigSchema);
