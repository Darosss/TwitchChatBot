import { Model, model, Schema } from "mongoose";
import { PersonalityDocument } from "./types";

const PersonalitySchema: Schema<PersonalityDocument> = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const Personality: Model<PersonalityDocument> = model(
  "Personalities",
  PersonalitySchema
);
