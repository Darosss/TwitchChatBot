import { isParamObjectId, checkSearchParams } from "@middlewares";
import { Router } from "express";

import { getTriggersList, addNewTrigger, editTriggerById, deleteTrigger } from "@controllers";

const triggersRouter = Router();

triggersRouter.get("/", checkSearchParams, getTriggersList);
triggersRouter.post("/create", addNewTrigger);
triggersRouter.patch("/:id", isParamObjectId, editTriggerById);
triggersRouter.delete("/delete/:id", isParamObjectId, deleteTrigger);

export default triggersRouter;
