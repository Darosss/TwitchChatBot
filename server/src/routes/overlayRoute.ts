import Express, { Router } from "express";
import {
  getOverlaysList,
  addNewOverlay,
  editOverlayById,
  removeOverlayById,
} from "@controllers/overlaysController";
const overlayRouter = Router();

overlayRouter.get("/", getOverlaysList);
overlayRouter.post("/create", addNewOverlay);
overlayRouter.post("/:id", editOverlayById);
overlayRouter.delete("/delete/:id", removeOverlayById);

export default overlayRouter;
