import Express, { Router } from "express";

import checkSearchParams from "@middlewares/checkSearchParams.middleware";
import isParamObjectId from "@middlewares/isParamObjectId.middleware";
import {
  getStreamSessionsList,
  getCurrentSession,
  getCurrentSessionStatistics,
  getSessionById,
  getSessionStatisticsById,
} from "@controllers/streamSessions.controller";

const streamSessionRouter = Router();

streamSessionRouter.get("/", checkSearchParams, getStreamSessionsList);
streamSessionRouter.get("/current-session", getCurrentSession);
streamSessionRouter.get(
  "/current-session/statistics",
  getCurrentSessionStatistics
);
streamSessionRouter.get("/:id", isParamObjectId, getSessionById);
streamSessionRouter.get(
  "/:id/statistics",
  isParamObjectId,
  getSessionStatisticsById
);

export default streamSessionRouter;
