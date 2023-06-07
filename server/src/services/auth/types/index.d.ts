export interface AuthCreateData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  obtainmentTimestamp: number;
  scope?: string[];
  userId?: string;
}
