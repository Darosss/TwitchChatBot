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
  getBadgeById,
  addCustomAchievement,
  editCustomAchievementById,
  deleteCustomAchievementById,
  editAchievementById
} from "@controllers";
import { checkSearchParams, isParamObjectId } from "@middlewares";
import { Router } from "express";

const achievementsRouter = Router();

achievementsRouter.get("/", checkSearchParams, getManyAchievements);

achievementsRouter.post("/custom/create", addCustomAchievement);
achievementsRouter.patch("/custom/:id", isParamObjectId, editCustomAchievementById);
achievementsRouter.delete("/custom/:id", deleteCustomAchievementById);

/* STAGES RELATED */
achievementsRouter.get("/stages", checkSearchParams, getManyAchievementStages);
achievementsRouter.post("/stages/create", addNewAchievementStage);
achievementsRouter.get("/stages/available-sounds", getAchievementStageSoundsList);
achievementsRouter.get("/stages/available-sounds/base-path", getAchievementStageSoundsBaseUrl);
achievementsRouter.post("/stages/sounds/upload", uploadAchievementStageSounds);
achievementsRouter.delete("/stages/sounds/:soundName/delete", deleteAchievementStageSoundById);
achievementsRouter.delete("/stages/delete/:id", isParamObjectId, deleteAchievementStageById);
achievementsRouter.get("/stages/:id", isParamObjectId, getAchievementStageById);
achievementsRouter.patch("/stages/:id", isParamObjectId, editAchievementStageById);

/* BADGE RELATED */
achievementsRouter.get("/badges", checkSearchParams, getManyBadges);
achievementsRouter.get("/badges/available-images", getBadgesImagesList);
achievementsRouter.get("/badges/available-images/base-path", getBadgesBaseUrl);
achievementsRouter.post("/badges/create", addNewBadge);
achievementsRouter.post("/badges/images/upload", uploadBadgeImages);
achievementsRouter.delete("/badges/images/:badgeName/delete", deleteBadgeImageByName);
achievementsRouter.delete("/badges/delete/:id", isParamObjectId, deleteBadgeById);
achievementsRouter.get("/badges/:id", isParamObjectId, getBadgeById);
achievementsRouter.patch("/badges/:id", isParamObjectId, editBadgeById);

achievementsRouter.get("/user/:id", isParamObjectId, getAchievementsProgressesByUserId);

achievementsRouter.patch("/:id", isParamObjectId, editAchievementById);

export default achievementsRouter;
