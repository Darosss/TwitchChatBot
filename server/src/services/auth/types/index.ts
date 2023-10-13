import { AuthModel } from "@models/types";

export interface AuthCreateData
  extends Pick<AuthModel, "accessToken" | "refreshToken" | "expiresIn" | "obtainmentTimestamp"> {
  scope?: string[];
  userId?: string;
}
