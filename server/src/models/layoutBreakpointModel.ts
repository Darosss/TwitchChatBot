import { Schema } from "mongoose";

export const layoutBreakpointSchema = new Schema({
  i: String,
  x: Number,
  y: Number,
  w: Number,
  h: Number,
  static: Boolean,
  isDraggable: Boolean,
  isResizable: Boolean,
});
