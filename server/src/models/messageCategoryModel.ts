import { Model, model, Schema } from "mongoose";
import { MessageCategoryDocument } from "./types";

const MessageCategorySchema: Schema<MessageCategoryDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      required: true,
      default: true,
    },
    messages: [String],
    uses: {
      type: Number,
      default: 0,
    },
    personality: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Personalities",
    },
    tag: { type: Schema.Types.ObjectId, required: true, ref: "Tags" },
    mood: { type: Schema.Types.ObjectId, required: true, ref: "Moods" },
  },
  { timestamps: true }
);

export const MessageCategory: Model<MessageCategoryDocument> = model(
  "MessageCategories",
  MessageCategorySchema
);
