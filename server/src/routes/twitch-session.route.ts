import Express, { Router } from "express";
import {
  getCurrentSession,
  getTwitchSessionsList,
  getCurrentSessionStatistics,
} from "@controllers/twitch-session.controller";
import checkSearchParams from "@middlewares/checkSearchParams.middleware";

const twitchSessionRouter = Router();

twitchSessionRouter.get("/", checkSearchParams, getTwitchSessionsList);
twitchSessionRouter.get("/current-session", getCurrentSession);
twitchSessionRouter.get(
  "/current-session/statistics",
  getCurrentSessionStatistics
);

export default twitchSessionRouter;
