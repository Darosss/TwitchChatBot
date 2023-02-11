import isParamObjectId from "@middlewares/isParamObjectId.middleware";
import Express, { Router } from "express";

import {
  getTriggers,
  addNewTrigger,
  //   getTriggerById,
  editTriggerById,
  deleteTrigger,
} from "@controllers/triggers.controller";
import checkSearchParams from "@middlewares/checkSearchParams.middleware";

const triggersRouter = Router();

triggersRouter.get("/", checkSearchParams, getTriggers);
triggersRouter.post("/create", addNewTrigger);
// triggersRouter.get("/:id", isParamObjectId, getTriggerById);
triggersRouter.post("/:id", isParamObjectId, editTriggerById);
triggersRouter.delete("/delete/:id", isParamObjectId, deleteTrigger);

export default triggersRouter;
