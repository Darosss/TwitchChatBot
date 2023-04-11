import { nameField } from "@utils/commonSchemaFieldsUtil";
import { Model, model, Schema } from "mongoose";
import { WidgetsDocument } from "./types";

const layoutBreakpointSchema = new Schema({
  i: String,
  x: Number,
  y: Number,
  w: Number,
  h: Number,
  static: Boolean,
  isDraggable: Boolean,
  isResizable: Boolean,
});

const WidgetsModel: Schema<WidgetsDocument> = new Schema(
  {
    ...nameField,
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
