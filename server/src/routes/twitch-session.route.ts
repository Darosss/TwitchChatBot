import Express, { Router } from "express";
import { getTwitchSessions } from "../controllers/twitch-session.controller";

const twitchSessionRouter = Router();

twitchSessionRouter.get("/", getTwitchSessions);

export default twitchSessionRouter;
