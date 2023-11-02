import {
  getAchievementStageByAchievementId,
  getAchievementsProgressesByUserId,
  getManyAchievements
} from "@controllers";
import { checkSearchParams, isParamObjectId } from "@middlewares";
import { Router } from "express";

const achievementsRouter = Router();

achievementsRouter.get("/", checkSearchParams, getManyAchievements);
achievementsRouter.get("/:id/stage", isParamObjectId, getAchievementStageByAchievementId);
achievementsRouter.get("/user/:id", isParamObjectId, getAchievementsProgressesByUserId);

export default achievementsRouter;
