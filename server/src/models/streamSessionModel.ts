import { Model, model, Schema } from "mongoose";
import { IStreamSessionDocument } from "./types";

const StreamSessionSchema: Schema<IStreamSessionDocument> = new Schema({
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
  watchers: {
    type: Map,
    of: Number,
  },
});

export const StreamSession: Model<IStreamSessionDocument> = model(
  "Sessions",
  StreamSessionSchema
);
