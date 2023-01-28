import Express, { Router } from "express";
import {
  getMessages,
  getUserMessages,
  getLatestAndFirstMsgs,
  getSessionMessages,
} from "../controllers/messages.controller";
import isParamObjectId from "../middlewares/isParamObjectId.middleware";

const messagesRouter = Router();

messagesRouter.get("/", getMessages);
messagesRouter.get("/twitch-session/:id", getSessionMessages);
messagesRouter.get(
  "/:id/latest-first-msgs",
  isParamObjectId,
  getLatestAndFirstMsgs
);
messagesRouter.get("/:id", isParamObjectId, getUserMessages);

export default messagesRouter;
