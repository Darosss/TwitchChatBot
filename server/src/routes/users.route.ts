import Express, { Router } from "express";
import {
  getUsers,
  getUsersProfile,
  editUserProfile,
} from "@controllers/users.controller";
import isParamObjectId from "@middlewares/isParamObjectId.middleware";

const usersRouter = Router();

usersRouter.get("/", getUsers);
usersRouter.get("/:id", isParamObjectId, getUsersProfile);
usersRouter.post("/:id", isParamObjectId, editUserProfile);

export default usersRouter;
