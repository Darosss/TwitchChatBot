import { Model, model, Schema } from "mongoose";
import { AuthDocument } from "./types";
import { encryptionKey } from "@configs";
import { encryptToken } from "@utils";

const AuthSchema: Schema<AuthDocument> = new Schema(
  {
    accessToken: { type: String, required: true },
    ivAccessToken: { type: Buffer },
    refreshToken: { type: String, required: true },
    ivRefreshToken: { type: Buffer },
    expiresIn: { type: Number, required: true, default: 0 },
    obtainmentTimestamp: { type: Number, required: true, default: 0 },
    scope: [String],
    userId: { type: String }
  },
  {
    capped: { size: 100000, max: 1 }
  }
);

AuthSchema.pre("save", async function (next) {
  try {
    // Encrypt access token
    const accessToken = this.accessToken;
    const { iv: ivAccessToken, encrypted: encryptedAccessToken } = encryptToken(accessToken, encryptionKey);
    this.accessToken = encryptedAccessToken;
    this.ivAccessToken = ivAccessToken;

    // Encrypt refresh token
    const refreshToken = this.refreshToken;
    const { iv: ivRefreshToken, encrypted: encryptedRefreshToken } = encryptToken(refreshToken, encryptionKey);
    this.refreshToken = encryptedRefreshToken;
    this.ivRefreshToken = ivRefreshToken;

    next();
  } catch (err) {
    if (err instanceof Error) {
      return next(err);
    }
    return next();
  }
});

export const AuthToken: Model<AuthDocument> = model("AuthTokens", AuthSchema);
