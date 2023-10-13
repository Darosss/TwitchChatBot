import { baseChatFeaturesFields, commonChatFeaturesFields, delayField, descriptionField } from "@utils";
import { Model, model, Schema } from "mongoose";
import { TimerDocument } from "./types";

const TimerSchema: Schema<TimerDocument> = new Schema(
  {
    ...baseChatFeaturesFields,
    ...commonChatFeaturesFields,
    ...delayField,
    ...descriptionField,
    points: { type: Number, default: 0 },
    reqPoints: { type: Number, default: 20 },
    nonFollowMulti: { type: Boolean, default: false },
    nonSubMulti: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Timer: Model<TimerDocument> = model("Timers", TimerSchema);
