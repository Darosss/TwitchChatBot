import { baseChatFeaturesFields, commonChatFeaturesFields, delayField } from "@utils/commonSchemaFieldsUtil";
import { Model, model, Schema } from "mongoose";
import { TriggerDocument } from "./types";

const TriggerSchema: Schema<TriggerDocument> = new Schema(
  {
    ...baseChatFeaturesFields,
    ...commonChatFeaturesFields,
    ...delayField,
    chance: { type: Number, default: 50 },
    onDelay: { type: Boolean, default: false },
    words: [String],
    mode: { type: String, default: "WHOLE-WORD" }
  },
  { timestamps: true }
);

export const Trigger: Model<TriggerDocument> = model("Triggers", TriggerSchema);
