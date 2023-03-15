import Express, { Router } from "express";
import {
  getWidgetsList,
  addNewWidget,
  editWidgetById,
  removeWidgetById,
  getWidgetById,
} from "@controllers/widgetsController";
const widgetsRouter = Router();

widgetsRouter.get("/", getWidgetsList);
widgetsRouter.post("/create", addNewWidget);
widgetsRouter.get("/:id", getWidgetById);
widgetsRouter.post("/:id", editWidgetById);
widgetsRouter.delete("/delete/:id", removeWidgetById);

export default widgetsRouter;
