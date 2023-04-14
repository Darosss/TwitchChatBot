import Express, { Router } from "express";
import { overlay, getTwitchAuthorizeUrl } from "@controllers/authController";
import authorizationTwitch from "@middlewares/authorizationTwitchMiddleware";
import twitchHandlersMiddleware from "@middlewares/twitchHandlersMiddleware";

const auth = Router();

auth.get(
  "/twitch/callback",
  authorizationTwitch,
  twitchHandlersMiddleware,
  overlay
);
auth.get("/authorize-url", getTwitchAuthorizeUrl);

export default auth;
