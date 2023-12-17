export interface AuthorizationTwitch {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
}

export interface RequestQueryAuthorizationTwitch {
  code: string;
  scope: string;
  state: string;
}
