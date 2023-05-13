import isParamObjectId from "@middlewares/isParamObjectIdMiddleware";
import { Router } from "express";

import {
  getMoodsList,
  addNewMood,
  // getMoodById,
  editMoodById,
  deleteMood
} from "@controllers/moodsController";
import checkSearchParams from "@middlewares/checkSearchParamsMiddleware";

const moodsRouter = Router();

moodsRouter.get("/", checkSearchParams, getMoodsList);
moodsRouter.post("/create", addNewMood);
// moodsRouter.get("/:id", isParamObjectId, getMoodById);
moodsRouter.post("/:id", isParamObjectId, editMoodById);
moodsRouter.delete("/delete/:id", isParamObjectId, deleteMood);

export default moodsRouter;
