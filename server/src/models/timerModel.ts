import { Model, model, Schema } from "mongoose";
import { TimerDocument } from "./types";

const TimerSchema: Schema<TimerDocument> = new Schema(
  {
    name: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    delay: { type: Number, required: true, default: 360 },
    points: { type: Number, default: 0 },
    reqPoints: { type: Number, default: 20 },
    nonFollowMulti: { type: Boolean, default: false },
    nonSubMulti: { type: Boolean, default: false },
    uses: { type: Number, default: 0 },
    description: { type: String },
    messages: [String],
  },
  { timestamps: true }
);

export const Timer: Model<TimerDocument> = model("Timers", TimerSchema);
