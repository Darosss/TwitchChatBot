import { clientId, redirectUrl } from "@configs";

export const getTwitchAuthUrl = () => {
  const scopes = [
    "channel:manage:polls",
    "channel:read:polls",
    "channel:read:redemptions",
    "channel:manage:redemptions",
    "channel:read:vips",
    "moderation:read",
    "moderator:read:chatters",
    "user:read:follows",
    "moderator:read:followers"
  ];
  const response_type = "code";
  const state = "c3ab8aa609ea11e793ae92361f002671";

  const authUrl = new URL(`https://id.twitch.tv/oauth2/authorize`);
  authUrl.searchParams.append("response_type", response_type);
  authUrl.searchParams.append("client_id", clientId);
  authUrl.searchParams.append("redirect_uri", redirectUrl);
  authUrl.searchParams.append("scope", scopes.join(" "));
  authUrl.searchParams.append("state", state);

  return authUrl;
};
