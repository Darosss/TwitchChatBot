import { RequestQuery } from "@types";
import retryWithCatch from "@utils/retryWithCatchUtil";
import { NextFunction, Request, Response } from "express";
import { AuthorizationTwitch } from "@types";
import { createNewAuth } from "@services/auth";

const authorizationTwitch = async (
  req: Request<{}, {}, {}, RequestQuery>,
  res: Response,
  next: NextFunction
) => {
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
  const { code, scope, state } = req.query as unknown as {
    code: string;
    scope: string;
    state: string;
  };
  const authRes = await retryWithCatch(() =>
    fetch("https://id.twitch.tv/oauth2/token", {
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
    })
  );

  if (authRes) {
    const authTwitchJson = (await authRes.json()) as AuthorizationTwitch;
    const newAuthToken = await createNewAuth({
      accessToken: authTwitchJson.access_token,
      refreshToken: authTwitchJson.refresh_token,
      expiresIn: authTwitchJson.expires_in,
      obtainmentTimestamp: new Date().getTime(),
      scope: authTwitchJson.scope,
    });

    return next();
  }
};

export default authorizationTwitch;
