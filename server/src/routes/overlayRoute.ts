import Express, { Router } from "express";
import { overlay, getTwitchAuthorizeUrl } from "@controllers/auth.controller";

const overlayRouter = Router();

overlayRouter.get("/twitch/callback", overlay);
overlayRouter.get("/authorize-url", getTwitchAuthorizeUrl);

export default overlayRouter;
