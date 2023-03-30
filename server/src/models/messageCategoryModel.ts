import {
  baseChatFeaturesFields,
  commonChatFeaturesFields,
} from "@utils/commonSchemaFieldsUtil";
import { Model, model, Schema } from "mongoose";
import { MessageCategoryDocument } from "./types";

const MessageCategorySchema: Schema<MessageCategoryDocument> = new Schema(
  {
    ...baseChatFeaturesFields,
    ...commonChatFeaturesFields,
  },
  { timestamps: true }
);

export const MessageCategory: Model<MessageCategoryDocument> = model(
  "MessageCategories",
  MessageCategorySchema
);
