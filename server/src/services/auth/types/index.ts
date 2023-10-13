import { AuthModel } from "@models";

export interface AuthCreateData
  extends Pick<AuthModel, "accessToken" | "refreshToken" | "expiresIn" | "obtainmentTimestamp"> {
  scope?: string[];
  userId?: string;
}
