import {
  editBadgeById,
  getAchievementsProgressesByUserId,
  getBadgesBaseUrl,
  getBadgesImagesList,
  getManyAchievements,
  getManyBadges,
  addNewBadge,
  deleteBadgeById,
  uploadBadgeImages,
  deleteBadgeImageByName,
  getManyAchievementStages,
  deleteAchievementStageById,
  getAchievementStageById,
  editAchievementStageById,
  getAchievementStageSoundsList,
  getAchievementStageSoundsBaseUrl,
  uploadAchievementStageSounds,
  deleteAchievementStageSoundById,
  addNewAchievementStage,
  getBadgeById
} from "@controllers";
import { checkSearchParams, isParamObjectId } from "@middlewares";
import { Router } from "express";

const achievementsRouter = Router();

achievementsRouter.get("/", checkSearchParams, getManyAchievements);

/* STAGES RELATED */
achievementsRouter.get("/stages", checkSearchParams, getManyAchievementStages);
achievementsRouter.post("/stages/create", addNewAchievementStage);
achievementsRouter.get("/stages/available-sounds", getAchievementStageSoundsList);
achievementsRouter.get("/stages/available-sounds/base-path", getAchievementStageSoundsBaseUrl);
achievementsRouter.post("/stages/sounds/upload", uploadAchievementStageSounds);
achievementsRouter.delete("/stages/sounds/:soundName/delete", deleteAchievementStageSoundById);
achievementsRouter.delete("/stages/delete/:id", isParamObjectId, deleteAchievementStageById);
achievementsRouter.get("/stages/:id", isParamObjectId, getAchievementStageById);
achievementsRouter.post("/stages/:id", isParamObjectId, editAchievementStageById);

/* BADGE RELATED */
achievementsRouter.get("/badges", checkSearchParams, getManyBadges);
achievementsRouter.get("/badges/available-images", getBadgesImagesList);
achievementsRouter.get("/badges/available-images/base-path", getBadgesBaseUrl);
achievementsRouter.post("/badges/create", addNewBadge);
achievementsRouter.post("/badges/images/upload", uploadBadgeImages);
achievementsRouter.delete("/badges/images/:badgeName/delete", deleteBadgeImageByName);
achievementsRouter.delete("/badges/delete/:id", isParamObjectId, deleteBadgeById);
achievementsRouter.get("/badges/:id", isParamObjectId, getBadgeById);
achievementsRouter.post("/badges/:id", isParamObjectId, editBadgeById);

achievementsRouter.get("/user/:id", isParamObjectId, getAchievementsProgressesByUserId);

export default achievementsRouter;
