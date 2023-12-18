import { clientId, discordClientId, redirectUrl } from "@configs";

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
    "moderator:read:followers",
    "channel:read:subscriptions",
    "bits:read"
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

export const getDiscordInviteUrl = () => {
  const scopes = ["applications.commands", "bot"];

  const url = new URL("https://discord.com/api/oauth2/authorize");
  url.searchParams.append("client_id", discordClientId);
  url.searchParams.append("permissions", "8");

  return url + `&scope=${scopes.join("+")}`;
};
