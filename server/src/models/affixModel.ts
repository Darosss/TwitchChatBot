import { baseChatFeaturesFields, prefixChanceField, prefixesField, suffixChanceField, suffixesField } from "@utils";
import { Model, model, Schema } from "mongoose";
import { AffixDocument } from "./types";

const AffixSchema: Schema<AffixDocument> = new Schema(
  {
    ...baseChatFeaturesFields,
    ...suffixChanceField,
    ...prefixChanceField,
    ...prefixesField,
    ...suffixesField
  },
  { timestamps: true }
);

export const Affix: Model<AffixDocument> = model("Affixes", AffixSchema);
