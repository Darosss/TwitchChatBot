import { Model, model, Schema } from "mongoose";
import { TagDocument } from "./types";

const TagSchema: Schema<TagDocument> = new Schema(
  {
    name: { type: String, required: true },
    enabled: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export const Tag: Model<TagDocument> = model("Tags", TagSchema);
