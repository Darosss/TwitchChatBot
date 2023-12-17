import { baseChatFeaturesFields } from "@utils";
import { Model, model, Schema } from "mongoose";
import { TagDocument } from "./types";

const TagSchema: Schema<TagDocument> = new Schema(
  {
    ...baseChatFeaturesFields
  },
  { timestamps: true }
);

export const Tag: Model<TagDocument> = model("Tags", TagSchema);
