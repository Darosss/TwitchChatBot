import {
  baseChatFeaturesFields,
  prefixesField,
  sufixesField,
} from "@utils/commonSchemaFieldsUtil";
import { Model, model, Schema } from "mongoose";
import { AffixDocument } from "./types";

const AffixSchema: Schema<AffixDocument> = new Schema(
  {
    ...baseChatFeaturesFields,
    ...prefixesField,
    ...sufixesField,
  },
  { timestamps: true }
);

export const Affix: Model<AffixDocument> = model("Affixes", AffixSchema);
