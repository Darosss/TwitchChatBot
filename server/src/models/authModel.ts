import { Model, model, Schema } from "mongoose";
import { AuthDocument } from "./types";

const AuthSchema: Schema<AuthDocument> = new Schema(
  {
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresIn: { type: Number, require: true, default: 0 },
    obtainmentTimestamp: { type: Number, required: true, default: 0 },
    scope: [String],
  },
  {
    capped: { size: 100000, max: 1 },
  }
);

export const AuthToken: Model<AuthDocument> = model("AuthTokens", AuthSchema);
