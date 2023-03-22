import { Model, model, Schema } from "mongoose";
import { WidgetsDocument } from "./types";

const layoutBreakpointSchema = new Schema({
  i: String,
  x: Number,
  y: Number,
  w: Number,
  h: Number,
  static: Boolean,
});

const WidgetsModel: Schema<WidgetsDocument> = new Schema(
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

export const Widgets: Model<WidgetsDocument> = model("Widgets", WidgetsModel);
