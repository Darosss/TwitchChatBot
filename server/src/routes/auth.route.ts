import Express, { Router } from "express";
import { overlay, getTwitchAuthorizeUrl } from "@controllers/auth.controller";

const auth = Router();

auth.get("/twitch/callback", overlay);
auth.get("/authorize-url", getTwitchAuthorizeUrl);

export default auth;