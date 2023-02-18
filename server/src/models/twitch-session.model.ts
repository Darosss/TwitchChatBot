import { Model, model, Schema } from "mongoose";
import { ITwitchSessionDocument } from "./types";

const TwitchSessionSchema: Schema<ITwitchSessionDocument> = new Schema({
  sessionStart: { type: Date, required: true, default: new Date() },
  sessionEnd: { type: Date },
  sessionTitles: { type: [String] },
  categories: { type: [String] },
  tags: { type: [String] },
  viewers: {
    type: Map,
    of: Number,
  },
});

export const TwitchSession: Model<ITwitchSessionDocument> = model(
  "Sessions",
  TwitchSessionSchema
);
