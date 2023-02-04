import Express, { Router } from "express";
import { getTwitchSessions } from "@controllers/twitch-session.controller";
import checkSearchParams from "@middlewares/checkSearchParams.middleware";

const twitchSessionRouter = Router();

twitchSessionRouter.get("/", checkSearchParams, getTwitchSessions);

export default twitchSessionRouter;
