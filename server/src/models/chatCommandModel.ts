import { Model, model, Schema } from "mongoose";
import { ChatCommandDocument } from "./types";

const ChatCommandSchema: Schema<ChatCommandDocument> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    enabled: { type: Boolean, default: true },
    aliases: [String],
    messages: [String],
    privilege: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    uses: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const ChatCommand: Model<ChatCommandDocument> = model(
  "ChatCommands",
  ChatCommandSchema
);
