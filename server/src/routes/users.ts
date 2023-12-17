import { Router } from "express";
import {
  getUsersList,
  getUsersProfile,
  editUserProfile,
  getUserMessages,
  getUserRedemptions,
  getLatestEldestUserMessages,
  getUsersByIds
} from "@controllers";
import { checkSearchParams, isParamObjectId } from "@middlewares";

const usersRouter = Router();

usersRouter.get("/", checkSearchParams, getUsersList);
usersRouter.get("/by-ids/:id", checkSearchParams, getUsersByIds);
usersRouter.get("/:id", isParamObjectId, getUsersProfile);
usersRouter.get("/:id/messages", isParamObjectId, getUserMessages);
usersRouter.get("/:id/redemptions", isParamObjectId, getUserRedemptions);
usersRouter.get("/:id/messages/latest-eldest", isParamObjectId, getLatestEldestUserMessages);
usersRouter.post("/:id", isParamObjectId, editUserProfile);

export default usersRouter;
