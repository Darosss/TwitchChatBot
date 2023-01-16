import { Model, model, Schema } from "mongoose";
import { IUserDocument } from "./types";

const UserSchema: Schema<IUserDocument> = new Schema({
  username: { type: String, required: true },
  points: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, required: true, default: new Date() },
});

export const User: Model<IUserDocument> = model("User", UserSchema);
