import { isParamObjectId, checkSearchParams } from "@middlewares";
import { Router } from "express";

import { getMoodsList, addNewMood, editMoodById, deleteMood } from "@controllers";

const moodsRouter = Router();

moodsRouter.get("/", checkSearchParams, getMoodsList);
moodsRouter.post("/create", addNewMood);
moodsRouter.patch("/:id", isParamObjectId, editMoodById);
moodsRouter.delete("/delete/:id", isParamObjectId, deleteMood);

export default moodsRouter;
