import { baseChatFeaturesFields, chatFeaturesModeFields } from "@utils";
import mongoose, { Model, model, Schema } from "mongoose";
import { MessageCategoryDocument } from "./types";

const MessageCategorySchema: Schema<MessageCategoryDocument> = new Schema(
  {
    ...baseChatFeaturesFields,
    ...chatFeaturesModeFields,
    messages: {
      type: [mongoose.Schema.Types.Array as unknown] as Array<[string, number]>,
      default: [["default", 0]]
    }
  },
  { timestamps: true }
);

export const MessageCategory: Model<MessageCategoryDocument> = model("MessageCategories", MessageCategorySchema);
