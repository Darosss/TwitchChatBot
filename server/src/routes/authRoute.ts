import { Router } from "express";
import { afterTwitchAuthorization, getTwitchAuthorizeUrl } from "@controllers/authController";
import { authorizationTwitch, twitchHandlersMiddleware } from "@middlewares";

const auth = Router();

auth.get("/twitch/callback", authorizationTwitch, twitchHandlersMiddleware, afterTwitchAuthorization);
auth.get("/authorize-url", getTwitchAuthorizeUrl);

export default auth;
