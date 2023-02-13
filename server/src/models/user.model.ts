import { Model, model, Schema } from "mongoose";
import { IUserDocument } from "./types";

const UserSchema: Schema<IUserDocument> = new Schema({
  twitchId: { type: String, index: { unique: true }, required: true },
  username: { type: String },
  twitchName: { type: String },
  follower: { type: Date },
  notes: { type: [String] },
  privileges: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, required: true, default: Date.now },
  lastSeen: { type: Date, required: true, default: Date.now },
  points: { type: Number, default: 0 },
  messageCount: { type: Number, default: 0 },
});

export const User: Model<IUserDocument> = model("User", UserSchema);
