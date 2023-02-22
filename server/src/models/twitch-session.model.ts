import { Model, model, Schema } from "mongoose";
import { ITwitchSessionDocument } from "./types";

const TwitchSessionSchema: Schema<ITwitchSessionDocument> = new Schema({
  sessionStart: { type: Date, required: true, default: new Date() },
  sessionEnd: { type: Date },
  sessionTitles: {
    type: Map,
    of: String,
  },
  categories: {
    type: Map,
    of: String,
  },
  tags: {
    type: Map,
    of: String,
  },
  viewers: {
    type: Map,
    of: Number,
  },
});

export const TwitchSession: Model<ITwitchSessionDocument> = model(
  "Sessions",
  TwitchSessionSchema
);
