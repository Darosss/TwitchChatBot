import { Model, Schema, model } from "mongoose";
import { BadgeDocument } from "./types";

const badgeSchema = new Schema<BadgeDocument>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    imagesUrls: {
      x32: { type: String, required: true },
      x64: { type: String, required: true },
      x96: { type: String, required: true },
      x128: { type: String, required: true }
    }
  },
  { timestamps: true }
);

export const Badge: Model<BadgeDocument> = model("Badge", badgeSchema);
