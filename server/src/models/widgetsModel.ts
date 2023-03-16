import { Model, model, Schema } from "mongoose";
import { IWidgetsDocument } from "./types";

const WidgetsModel: Schema<IWidgetsDocument> = new Schema(
  {
    name: { type: String, required: true },
    layout: Object,
  },
  { timestamps: true }
);

export const Widgets: Model<IWidgetsDocument> = model("Widgets", WidgetsModel);
