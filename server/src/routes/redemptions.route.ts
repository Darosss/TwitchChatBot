import Express, { Router } from "express";
import {
  getRedemptions,
  getUserRedemptions,
  getSessionRedemptions,
} from "@controllers/redemptions.controller";
import checkSearchParams from "@middlewares/checkSearchParams.middleware";

const redemptionsRouter = Router();

redemptionsRouter.get("/", checkSearchParams, getRedemptions);
redemptionsRouter.get("/:id", getUserRedemptions);
redemptionsRouter.get(
  "/twitch-session/:id",
  checkSearchParams,
  getSessionRedemptions
);

export default redemptionsRouter;
