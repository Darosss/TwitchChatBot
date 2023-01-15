import { Model, model, Schema, Types } from "mongoose";
import { IMessageDocument } from "./types";

const MessageSchema: Schema<IMessageDocument> = new Schema({
  message: { type: String, required: true },
  date: { type: Date, required: true },
  owner: { type: Schema.Types.ObjectId, require: true, ref: "User" },
});

export const Message: Model<IMessageDocument> = model("Message", MessageSchema);
