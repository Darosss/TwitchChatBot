import { Model, model, Schema } from "mongoose";
import { TriggerDocument } from "./types";
const TriggerSchema: Schema<TriggerDocument> = new Schema(
  {
    name: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    chance: { type: Number, default: 50 },
    delay: { type: Number, default: 360 },
    onDelay: { type: Boolean, default: false },
    uses: { type: Number, default: 0 },
    words: [String],
    messages: [String],
    mode: { type: String, default: "WHOLE-WORD" },
  },
  { timestamps: true }
);

export const Trigger: Model<TriggerDocument> = model("Triggers", TriggerSchema);
