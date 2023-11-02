import { Model, Schema, model } from "mongoose";
import { BadgeDocument } from "./types";

const badgeSchema = new Schema<BadgeDocument>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true }
  },
  { timestamps: true }
);

export const Badge: Model<BadgeDocument> = model("Badge", badgeSchema);
