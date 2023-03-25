import isParamObjectId from "@middlewares/isParamObjectIdMiddleware";
import { Router } from "express";

import {
  getTimersList,
  addNewTimer,
  editTimerById,
  deleteTimer,
} from "@controllers/timersController";
import checkSearchParams from "@middlewares/checkSearchParamsMiddleware";

const timersRouter = Router();

timersRouter.get("/", checkSearchParams, getTimersList);
timersRouter.post("/create", addNewTimer);
// timersRouter.get("/:id", isParamObjectId, getTimerById);
timersRouter.post("/:id", isParamObjectId, editTimerById);
timersRouter.delete("/delete/:id", isParamObjectId, deleteTimer);

export default timersRouter;
