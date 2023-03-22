import { Model, model, Schema, Types } from "mongoose";
import { MessageDocument } from "./types";

const MessageSchema: Schema<MessageDocument> = new Schema({
  message: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  owner: { type: Schema.Types.ObjectId, require: true, ref: "User" },
  ownerUsername: { type: String, required: true },
});

export const Message: Model<MessageDocument> = model("Message", MessageSchema);
