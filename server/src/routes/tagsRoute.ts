import isParamObjectId from "@middlewares/isParamObjectIdMiddleware";
import Express, { Router } from "express";

import {
  getTagsList,
  addNewTag,
  // getTagById,
  editTagById,
  deleteTag,
} from "@controllers/tagsController";
import checkSearchParams from "@middlewares/checkSearchParamsMiddleware";

const tagsRouter = Router();

tagsRouter.get("/", checkSearchParams, getTagsList);
tagsRouter.post("/create", addNewTag);
// tagsRouter.get("/:id", isParamObjectId, getTagById);
tagsRouter.post("/:id", isParamObjectId, editTagById);
tagsRouter.delete("/delete/:id", isParamObjectId, deleteTag);

export default tagsRouter;
