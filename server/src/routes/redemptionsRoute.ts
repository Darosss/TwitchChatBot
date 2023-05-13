import { Router } from "express";
import { getRedemptionsList } from "@controllers/redemptionsController";
import checkSearchParams from "@middlewares/checkSearchParamsMiddleware";

const redemptionsRouter = Router();

redemptionsRouter.get("/", checkSearchParams, getRedemptionsList);

export default redemptionsRouter;
