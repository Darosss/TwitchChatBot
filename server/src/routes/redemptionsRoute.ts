import { Router } from "express";
import { getRedemptionsList } from "@controllers/redemptionsController";
import { checkSearchParams } from "@middlewares";

const redemptionsRouter = Router();

redemptionsRouter.get("/", checkSearchParams, getRedemptionsList);

export default redemptionsRouter;
