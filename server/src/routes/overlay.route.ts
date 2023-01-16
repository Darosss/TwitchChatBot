import Express, { Router } from "express";
import overlay from "../controllers/overlay.controller";

const overlayRouter = Router();

overlayRouter.get("/", overlay);

export default overlayRouter;
