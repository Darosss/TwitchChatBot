import { Router } from "express";
import checkSearchParams from "@middlewares/checkSearchParamsMiddleware";
import {
  getMessageCategoriesList,
  editMessageCategoryById,
  addNewCategory,
  deleteMessageCategoryById,
  updateUsesCategoryById
} from "@controllers/messageCategoriesController";
import isParamObjectId from "@middlewares/isParamObjectIdMiddleware";

const messageCategoriesRouter = Router();

messageCategoriesRouter.get("/", checkSearchParams, getMessageCategoriesList);
messageCategoriesRouter.post("/create", addNewCategory);
messageCategoriesRouter.post("/:id", isParamObjectId, editMessageCategoryById);
messageCategoriesRouter.post("/:id/uses", isParamObjectId, updateUsesCategoryById);
messageCategoriesRouter.delete("/delete/:id", isParamObjectId, deleteMessageCategoryById);

export default messageCategoriesRouter;
