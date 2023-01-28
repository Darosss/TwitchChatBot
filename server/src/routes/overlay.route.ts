import Express, { Router } from "express";
import {
  overlay,
  getTwitchAuthorizeUrl,
} from "../controllers/overlay.controller";

const overlayRouter = Router();

overlayRouter.get("/", overlay);
overlayRouter.get("/twitch-authorize-url", getTwitchAuthorizeUrl);

export default overlayRouter;
