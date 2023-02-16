import Express, { Router } from "express";
import { getTwitchSessionsList } from "@controllers/twitch-session.controller";
import checkSearchParams from "@middlewares/checkSearchParams.middleware";

const twitchSessionRouter = Router();

twitchSessionRouter.get("/", checkSearchParams, getTwitchSessionsList);

export default twitchSessionRouter;
