import { Model, model, Schema } from "mongoose";
import { IMessageCategoryDocument } from "./types";

const MessageCategorySchema: Schema<IMessageCategoryDocument> = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    messages: [String],
  },
  { timestamps: true }
);

export const MessageCategory: Model<IMessageCategoryDocument> = model(
  "MessageCategories",
  MessageCategorySchema
);
