import { Router } from "express";
import { getOverlaysList, addNewOverlay, editOverlayById, removeOverlayById, getOverlayById } from "@controllers";
const overlayRouter = Router();

overlayRouter.get("/", getOverlaysList);
overlayRouter.post("/create", addNewOverlay);
overlayRouter.get("/:id", getOverlayById);
overlayRouter.patch("/:id", editOverlayById);
overlayRouter.delete("/delete/:id", removeOverlayById);

export default overlayRouter;
