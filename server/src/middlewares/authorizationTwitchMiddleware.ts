import { RequestQueryAuthorizationTwitch } from "@types";
import retryWithCatch from "@utils/retryWithCatchUtil";
import { NextFunction, Request, Response } from "express";
import { AuthorizationTwitch } from "@types";
import { createNewAuth } from "@services/auth";
import { clientId, clientSecret, redirectUrl } from "@configs/envVariables";

const authorizationTwitch = async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.query as unknown as RequestQueryAuthorizationTwitch;
  const authRes = await retryWithCatch(() =>
    fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUrl
      }).toString()
    })
  );

  if (authRes) {
    const authTwitchJson = (await authRes.json()) as AuthorizationTwitch;
    await createNewAuth({
      accessToken: authTwitchJson.access_token,
      refreshToken: authTwitchJson.refresh_token,
      expiresIn: authTwitchJson.expires_in,
      obtainmentTimestamp: new Date().getTime(),
      scope: authTwitchJson.scope
    });

    return next();
  }
};

export default authorizationTwitch;
