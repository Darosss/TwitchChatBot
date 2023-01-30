import { Model, model, Schema } from "mongoose";
import { ITriggerDocument } from "./types";

const TriggerSchema: Schema<ITriggerDocument> = new Schema({
  name: { type: String, required: true },
  enabled: { type: Boolean, required: true, default: true },
  chance: { type: Number, required: true, default: 50 },
  delay: { type: Number, required: true, default: 360 },
  onDelay: { type: Boolean, default: false },
  words: [String],
  messages: [String],
});

export const Trigger: Model<ITriggerDocument> = model(
  "Triggers",
  TriggerSchema
);
