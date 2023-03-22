import { Model, model, Schema } from "mongoose";
import { MessageCategoryDocument } from "./types";

const MessageCategorySchema: Schema<MessageCategoryDocument> = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    messages: [String],
    uses: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const MessageCategory: Model<MessageCategoryDocument> = model(
  "MessageCategories",
  MessageCategorySchema
);
