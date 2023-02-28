import Express, { Router } from "express";
import {
  getMessagesList,
  getSessionMessages,
  getLatestAndFirstMsgs,
  getUserMessages,
} from "@controllers/messagesController";
import checkSearchParams from "@middlewares/checkSearchParamsMiddleware";
import isParamObjectId from "@middlewares/isParamObjectIdMiddleware";

const messagesRouter = Router();

messagesRouter.get("/", checkSearchParams, checkSearchParams, getMessagesList);
messagesRouter.get(
  "/stream-session/:id",
  isParamObjectId,
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
