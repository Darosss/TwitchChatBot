import { Model, model, Schema } from "mongoose";
import { OverlayDocument } from "./types";
import { nameField } from "@utils/commonSchemaFieldsUtil";

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

const OverlaySchema: Schema<OverlayDocument> = new Schema(
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

export const Overlay: Model<OverlayDocument> = model("Overlays", OverlaySchema);
