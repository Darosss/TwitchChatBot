import { Model, model, Schema } from "mongoose";
import { IUserDocument } from "./types";

const UserSchema: Schema<IUserDocument> = new Schema({
  username: { type: String, required: true },
  points: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, required: true, default: new Date() },
  lastSeen: { type: Date, required: true, default: new Date() },
  messageCount: { type: Number, required: true, default: 0 },
  notes: { type: [String] },
});

export const User: Model<IUserDocument> = model("User", UserSchema);
