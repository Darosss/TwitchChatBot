import { Model, model, Schema } from "mongoose";
import { IWidgetsDocument } from "./types";

const layoutBreakpointSchema = new Schema({
  i: String,
  x: Number,
  y: Number,
  w: Number,
  h: Number,
  static: Boolean,
});

const WidgetsModel: Schema<IWidgetsDocument> = new Schema(
  {
    name: { type: String, required: true },
    layout: {
      type: Map,
      of: [layoutBreakpointSchema],
      default: new Map(),
    },
    toolbox: {
      type: Map,
      of: [layoutBreakpointSchema],
      default: new Map(),
    },
  },
  { timestamps: true }
);

export const Widgets: Model<IWidgetsDocument> = model("Widgets", WidgetsModel);
