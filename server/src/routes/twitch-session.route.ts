import Express, { Router } from "express";
import {
  getCurrentSession,
  getTwitchSessionsList,
  getCurrentSessionStatistics,
  getSessionStatisticsById,
  getSessionById,
} from "@controllers/twitch-session.controller";
import checkSearchParams from "@middlewares/checkSearchParams.middleware";
import isParamObjectId from "@middlewares/isParamObjectId.middleware";

const twitchSessionRouter = Router();

twitchSessionRouter.get("/", checkSearchParams, getTwitchSessionsList);
twitchSessionRouter.get("/current-session", getCurrentSession);
twitchSessionRouter.get(
  "/current-session/statistics",
  getCurrentSessionStatistics
);
twitchSessionRouter.get("/:id", isParamObjectId, getSessionById);
twitchSessionRouter.get(
  "/:id/statistics",
  isParamObjectId,
  getSessionStatisticsById
);

export default twitchSessionRouter;
