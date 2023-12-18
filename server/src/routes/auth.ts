import { Router } from "express";
import { afterTwitchAuthorization, getDiscordInviteUrl, getTwitchAuthorizeUrl } from "@controllers";
import { authorizationTwitch } from "@middlewares";

const auth = Router();

auth.get("/twitch/callback", authorizationTwitch, afterTwitchAuthorization);
auth.get("/authorize-url", getTwitchAuthorizeUrl);
auth.get("/discord/invite", getDiscordInviteUrl);

export default auth;
