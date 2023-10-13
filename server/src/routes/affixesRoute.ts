import { isParamObjectId, checkSearchParams } from "@middlewares";
import { Router } from "express";

import {
  getAffixesList,
  addNewAffix,
  // getAffixById,
  editAffixById,
  deleteAffix
} from "@controllers";

const affixesRouter = Router();

affixesRouter.get("/", checkSearchParams, getAffixesList);
affixesRouter.post("/create", addNewAffix);
// affixesRouter.get("/:id", isParamObjectId, getAffixById);
affixesRouter.post("/:id", isParamObjectId, editAffixById);
affixesRouter.delete("/delete/:id", isParamObjectId, deleteAffix);

export default affixesRouter;
