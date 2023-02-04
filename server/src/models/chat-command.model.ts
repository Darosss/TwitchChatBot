import { Model, model, Schema } from "mongoose";
import { IChatCommandDocument } from "./types";

const ChatCommandSchema: Schema<IChatCommandDocument> = new Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  description: { type: String },
  enabled: { type: Boolean, default: true },
  aliases: [String],
  messages: [String],
  privilage: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  useCount: {
    type: Number,
    default: 0,
  },
});

export const ChatCommand: Model<IChatCommandDocument> = model(
  "ChatCommands",
  ChatCommandSchema
);
