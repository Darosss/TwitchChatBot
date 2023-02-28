import Express, { Router } from "express";
import {
  getRedemptionsList,
  getUserRedemptions,
  getSessionRedemptions,
} from "@controllers/redemptionsController";
import checkSearchParams from "@middlewares/checkSearchParamsMiddleware";

const redemptionsRouter = Router();

redemptionsRouter.get("/", checkSearchParams, getRedemptionsList);
redemptionsRouter.get("/:id", getUserRedemptions);
redemptionsRouter.get(
  "/stream-session/:id",
  checkSearchParams,
  getSessionRedemptions
);

export default redemptionsRouter;
