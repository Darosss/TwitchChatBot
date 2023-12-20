import { isParamObjectId, checkSearchParams } from "@middlewares";
import { Router } from "express";

import { getTagsList, addNewTag, editTagById, deleteTag } from "@controllers";

const tagsRouter = Router();

tagsRouter.get("/", checkSearchParams, getTagsList);
tagsRouter.post("/create", addNewTag);
tagsRouter.patch("/:id", isParamObjectId, editTagById);
tagsRouter.delete("/delete/:id", isParamObjectId, deleteTag);

export default tagsRouter;
