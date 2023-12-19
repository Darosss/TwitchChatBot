import { Router } from "express";
import { getWidgetsList, addNewWidget, editWidgetById, removeWidgetById, getWidgetById } from "@controllers";
const widgetsRouter = Router();

widgetsRouter.get("/", getWidgetsList);
widgetsRouter.post("/create", addNewWidget);
widgetsRouter.get("/:id", getWidgetById);
widgetsRouter.patch("/:id", editWidgetById);
widgetsRouter.delete("/delete/:id", removeWidgetById);

export default widgetsRouter;
