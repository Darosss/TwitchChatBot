import isParamObjectId from "@middlewares/isParamObjectIdMiddleware";
import Express, { Router } from "express";

import {
  getPersonalitiesList,
  addNewPersonality,
  // getPersonalityById,
  editPersonalityById,
  deletePersonality,
} from "@controllers/personalitiesController";
import checkSearchParams from "@middlewares/checkSearchParamsMiddleware";

const personalitiesRouter = Router();

personalitiesRouter.get("/", checkSearchParams, getPersonalitiesList);
personalitiesRouter.post("/create", addNewPersonality);
// personalitiesRouter.get("/:id", isParamObjectId, getPersonalityById);
personalitiesRouter.post("/:id", isParamObjectId, editPersonalityById);
personalitiesRouter.delete("/delete/:id", isParamObjectId, deletePersonality);

export default personalitiesRouter;
