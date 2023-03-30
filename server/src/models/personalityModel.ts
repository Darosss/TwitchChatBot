import { baseChatFeaturesFields } from "@utils/commonSchemaFieldsUtil";
import { Model, model, Schema } from "mongoose";
import { PersonalityDocument } from "./types";

const PersonalitySchema: Schema<PersonalityDocument> = new Schema(
  {
    ...baseChatFeaturesFields,
  },
  { timestamps: true }
);

export const Personality: Model<PersonalityDocument> = model(
  "Personalities",
  PersonalitySchema
);
