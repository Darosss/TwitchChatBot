import Express, { Router } from "express";
import {
  getUsersList,
  getUsersProfile,
  editUserProfile,
} from "@controllers/usersController";
import checkSearchParams from "@middlewares/checkSearchParamsMiddleware";
import isParamObjectId from "@middlewares/isParamObjectIdMiddleware";

const usersRouter = Router();

usersRouter.get("/", checkSearchParams, getUsersList);
usersRouter.get("/:id", isParamObjectId, getUsersProfile);
usersRouter.post("/:id", isParamObjectId, editUserProfile);

export default usersRouter;
