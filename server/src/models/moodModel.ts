import { Model, model, Schema } from "mongoose";
import { MoodDocument } from "./types";

const MoodSchema: Schema<MoodDocument> = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const Mood: Model<MoodDocument> = model("Moods", MoodSchema);