import { isParamObjectId, checkSearchParams } from "@middlewares";
import { Router } from "express";

import {
  getTagsList,
  addNewTag,
  // getTagById,
  editTagById,
  deleteTag
} from "@controllers/tagsController";

const tagsRouter = Router();

tagsRouter.get("/", checkSearchParams, getTagsList);
tagsRouter.post("/create", addNewTag);
// tagsRouter.get("/:id", isParamObjectId, getTagById);
tagsRouter.post("/:id", isParamObjectId, editTagById);
tagsRouter.delete("/delete/:id", isParamObjectId, deleteTag);

export default tagsRouter;
