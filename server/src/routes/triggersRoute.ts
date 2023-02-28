import isParamObjectId from "@middlewares/isParamObjectIdMiddleware";
import Express, { Router } from "express";

import {
  getTriggersList,
  addNewTrigger,
  //   getTriggerById,
  editTriggerById,
  deleteTrigger,
} from "@controllers/triggersController";
import checkSearchParams from "@middlewares/checkSearchParamsMiddleware";

const triggersRouter = Router();

triggersRouter.get("/", checkSearchParams, getTriggersList);
triggersRouter.post("/create", addNewTrigger);
// triggersRouter.get("/:id", isParamObjectId, getTriggerById);
triggersRouter.post("/:id", isParamObjectId, editTriggerById);
triggersRouter.delete("/delete/:id", isParamObjectId, deleteTrigger);

export default triggersRouter;
