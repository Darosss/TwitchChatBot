import isParamObjectId from "@middlewares/isParamObjectIdMiddleware";
import Express, { Router } from "express";

import {
  getAffixesList,
  addNewAffix,
  // getAffixById,
  editAffixById,
  deleteAffix,
} from "@controllers/affixesController";
import checkSearchParams from "@middlewares/checkSearchParamsMiddleware";

const affixesRouter = Router();

affixesRouter.get("/", checkSearchParams, getAffixesList);
affixesRouter.post("/create", addNewAffix);
// affixesRouter.get("/:id", isParamObjectId, getAffixById);
affixesRouter.post("/:id", isParamObjectId, editAffixById);
affixesRouter.delete("/delete/:id", isParamObjectId, deleteAffix);

export default affixesRouter;
