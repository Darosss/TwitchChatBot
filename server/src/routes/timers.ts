import { isParamObjectId, checkSearchParams } from "@middlewares";
import { Router } from "express";

import { getTimersList, addNewTimer, editTimerById, deleteTimer } from "@controllers";

const timersRouter = Router();

timersRouter.get("/", checkSearchParams, getTimersList);
timersRouter.post("/create", addNewTimer);
timersRouter.patch("/:id", isParamObjectId, editTimerById);
timersRouter.delete("/delete/:id", isParamObjectId, deleteTimer);

export default timersRouter;
