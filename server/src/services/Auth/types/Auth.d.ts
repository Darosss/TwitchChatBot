export interface AuthCreateData {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn?: number | null;
  obtainmentTimestamp?: number;
  scope?: string[];
}
