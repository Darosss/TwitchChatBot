import { Model, model, Schema } from "mongoose";
import { ITriggerDocument } from "./types";

const TriggerSchema: Schema<ITriggerDocument> = new Schema(
  {
    name: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    chance: { type: Number, default: 50 },
    delay: { type: Number, default: 360 },
    onDelay: { type: Boolean, default: false },
    // createdAt: { type: Date, required: true, default: Date.now },
    words: [String],
    messages: [String],
  },
  { timestamps: true }
);

export const Trigger: Model<ITriggerDocument> = model(
  "Triggers",
  TriggerSchema
);
