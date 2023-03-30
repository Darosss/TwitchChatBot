import {
  baseChatFeaturesFields,
  commonChatFeaturesFields,
  descriptionField,
} from "@utils/commonSchemaFieldsUtil";
import { Model, model, Schema } from "mongoose";
import { ChatCommandDocument } from "./types";

const ChatCommandSchema: Schema<ChatCommandDocument> = new Schema(
  {
    ...baseChatFeaturesFields,
    ...commonChatFeaturesFields,
    ...descriptionField,
    aliases: [String],
    privilege: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
  },
  { timestamps: true }
);

export const ChatCommand: Model<ChatCommandDocument> = model(
  "ChatCommands",
  ChatCommandSchema
);
