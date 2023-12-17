import { Model, model, Schema } from "mongoose";
import { OverlayDocument } from "./types";
import { nameField } from "@utils";
import { layoutBreakpointSchema } from "../layouts";

const OverlaySchema: Schema<OverlayDocument> = new Schema(
  {
    ...nameField,
    layout: {
      type: Map,
      of: [layoutBreakpointSchema],
      default: new Map()
    },
    toolbox: {
      type: Map,
      of: [layoutBreakpointSchema],
      default: new Map()
    },
    styles: {
      type: Map,
      of: String,
      defaulot: new Map()
    }
  },
  { timestamps: true }
);

export const Overlay: Model<OverlayDocument> = model("Overlays", OverlaySchema);
