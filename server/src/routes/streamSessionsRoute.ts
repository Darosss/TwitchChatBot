import { Router } from "express";
import {
  getStreamSessionsList,
  getCurrentSession,
  getCurrentSessionStatistics,
  getSessionById,
  getSessionStatisticsById,
  getSessionMessages,
  getSessionRedemptions,
  getCurrentSessionMessages,
  getCurrentSessionRedemptions
} from "@controllers/streamSessionsController";
import checkSearchParams from "@middlewares/checkSearchParamsMiddleware";
import isParamObjectId from "@middlewares/isParamObjectIdMiddleware";

const streamSessionsRouter = Router();

streamSessionsRouter.get("/", checkSearchParams, getStreamSessionsList);
streamSessionsRouter.get("/current-session", getCurrentSession);
streamSessionsRouter.get("/current-session/messages", getCurrentSessionMessages);
streamSessionsRouter.get("/current-session/redemptions", getCurrentSessionRedemptions);
streamSessionsRouter.get("/current-session/statistics", getCurrentSessionStatistics);
streamSessionsRouter.get("/:id", isParamObjectId, getSessionById);
streamSessionsRouter.get("/:id/messages", isParamObjectId, getSessionMessages);
streamSessionsRouter.get("/:id/redemptions", isParamObjectId, getSessionRedemptions);
streamSessionsRouter.get("/:id/statistics", isParamObjectId, getSessionStatisticsById);

export default streamSessionsRouter;
