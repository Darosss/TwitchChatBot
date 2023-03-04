import { Model, model, Schema } from "mongoose";
import { IStreamSessionDocument } from "./types";

const StreamSessionSchema: Schema<IStreamSessionDocument> = new Schema({
  sessionStart: { type: Date, required: true, default: Date.now },
  sessionEnd: { type: Date },
  sessionTitles: {
    type: Map,
    of: String,
    default: new Map(),
  },
  categories: {
    type: Map,
    of: String,
    default: new Map(),
  },
  tags: {
    type: Map,
    of: String,
    default: new Map(),
  },
  viewers: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  watchers: {
    type: Map,
    of: Number,
    default: new Map(),
  },
});

export const StreamSession: Model<IStreamSessionDocument> = model(
  "Sessions",
  StreamSessionSchema
);
