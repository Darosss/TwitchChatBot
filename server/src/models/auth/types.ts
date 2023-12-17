import { Document } from "mongoose";

export interface AuthModel {
  _id: string;
  accessToken: string;
  ivAccessToken: Buffer;
  refreshToken: string;
  ivRefreshToken: Buffer;
  expiresIn: number;
  obtainmentTimestamp: number;
  scope: string[];
  userId: string;
}

export type AuthDocument = AuthModel & Document;
