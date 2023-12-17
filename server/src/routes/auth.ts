import { Router } from "express";
import { afterTwitchAuthorization, getTwitchAuthorizeUrl } from "@controllers";
import { authorizationTwitch } from "@middlewares";

const auth = Router();

auth.get("/twitch/callback", authorizationTwitch, afterTwitchAuthorization);
auth.get("/authorize-url", getTwitchAuthorizeUrl);

export default auth;
