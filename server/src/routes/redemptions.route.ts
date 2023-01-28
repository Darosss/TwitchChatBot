import Express, { Router } from "express";
import {
  getRedemptions,
  getUserRedemptions,
  getSessionRedemptions,
} from "../controllers/redemptions.controller";

const redemptionsRouter = Router();

redemptionsRouter.get("/", getRedemptions);
redemptionsRouter.get("/:id", getUserRedemptions);
redemptionsRouter.get("/twitch-session/:id", getSessionRedemptions);

export default redemptionsRouter;
