import Express, { Router } from "express";
import {
  getMessages,
  getUserMessages,
  getLatestAndFirstMsgs,
} from "../controllers/messages.controller";
import isParamObjectId from "../middlewares/isParamObjectId.middleware";

const messagesRouter = Router();

messagesRouter.get("/", getMessages);
messagesRouter.get(
  "/:id/latest-first-msgs",
  isParamObjectId,
  getLatestAndFirstMsgs
);
messagesRouter.get("/:id", isParamObjectId, getUserMessages);

export default messagesRouter;
