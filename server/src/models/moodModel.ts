import { baseChatFeaturesFields } from "@utils";
import { Model, model, Schema } from "mongoose";
import { MoodDocument } from "./types";

const MoodSchema: Schema<MoodDocument> = new Schema(
  {
    ...baseChatFeaturesFields
  },
  { timestamps: true }
);

export const Mood: Model<MoodDocument> = model("Moods", MoodSchema);
