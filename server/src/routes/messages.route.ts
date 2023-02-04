import Express, { Router } from "express";
import {
  getMessages,
  getUserMessages,
  getLatestAndFirstMsgs,
  getSessionMessages,
} from "@controllers/messages.controller";
import isParamObjectId from "@middlewares/isParamObjectId.middleware";
import checkSearchParams from "@middlewares/checkSearchParams.middleware";

const messagesRouter = Router();

messagesRouter.get("/", checkSearchParams, checkSearchParams, getMessages);
messagesRouter.get(
  "/twitch-session/:id",
  checkSearchParams,
  getSessionMessages
);
messagesRouter.get(
  "/:id/latest-first-msgs",
  isParamObjectId,
  checkSearchParams,
  getLatestAndFirstMsgs
);
messagesRouter.get("/:id", isParamObjectId, checkSearchParams, getUserMessages);

export default messagesRouter;
