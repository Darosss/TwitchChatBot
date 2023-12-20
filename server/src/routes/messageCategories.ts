import { Router } from "express";
import { checkSearchParams, isParamObjectId } from "@middlewares";
import {
  getMessageCategoriesList,
  editMessageCategoryById,
  addNewCategory,
  deleteMessageCategoryById,
  updateUsesCategoryById
} from "@controllers";

const messageCategoriesRouter = Router();

messageCategoriesRouter.get("/", checkSearchParams, getMessageCategoriesList);
messageCategoriesRouter.post("/create", addNewCategory);
messageCategoriesRouter.patch("/:id", isParamObjectId, editMessageCategoryById);
messageCategoriesRouter.patch("/:id/uses", isParamObjectId, updateUsesCategoryById);
messageCategoriesRouter.delete("/delete/:id", isParamObjectId, deleteMessageCategoryById);

export default messageCategoriesRouter;
