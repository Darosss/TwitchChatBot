import { IAuthorizationTwitch } from "@types";
import Express, { Request, Response } from "express";

import initTwitchOnAuth from "../twitch/initTwitchOnAuth";

export const overlay = async (req: Request, res: Response) => {
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

  const { code, scope, state } = req.query as unknown as {
    code: string;
    scope: string;
    state: string;
  };
  const authRes = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI!,
    }).toString(),
  });
  //GET auth respons with secret / access token
  if (authRes) {
    const authTwitchJson = (await authRes.json()) as IAuthorizationTwitch;

    initTwitchOnAuth(authTwitchJson, req.io);

    res.redirect(process.env.REDIRECT_AFTER_AUTH!);
  }
};

export const getTwitchAuthorizeUrl = (req: Request, res: Response) => {
  const scopes = [
    "channel:manage:polls",
    "channel:read:polls",
    "channel:read:redemptions",
    "channel:read:vips",
    "moderation:read",
    "moderator:read:chatters",
  ];
  const response_type = "code";
  const state = "c3ab8aa609ea11e793ae92361f002671";

  const authUrl = new URL(`https://id.twitch.tv/oauth2/authorize`);
  authUrl.searchParams.append("response_type", response_type);
  authUrl.searchParams.append("client_id", process.env.CLIENT_ID!);
  authUrl.searchParams.append("redirect_uri", process.env.REDIRECT_URI!);
  authUrl.searchParams.append("scope", scopes.join(" "));
  authUrl.searchParams.append("state", state);

  res.status(200).send({ data: authUrl });
};
