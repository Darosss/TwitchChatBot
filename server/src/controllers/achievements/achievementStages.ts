import {
  getAchievementStages,
  getAchievementStagesCount,
  deleteAchievementStageById as deleteAchievementStageByIdService,
  getAchievementStagesById,
  AchievementStageUpdateData,
  updateOneAchievementStage,
  deleteAchievementSound,
  AchievementStageCreateData,
  createAchievementStage
} from "@services";
import { RequestParams, RequestSearch } from "../types";
import { NextFunction, Request, Response } from "express";
import { filterAchievementStagesByUrlParams } from "./filters";
import { AppError, checkExistResource, filterMp3, getListOfFilesWithExtensionInFolder, logger } from "@utils";
import path from "path";
import { achievementsStagesSoundsPath, publicPath } from "@configs";
import multer from "multer";

const storageAchievementStagesSounds = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, achievementsStagesSoundsPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const uploadAchievementStageSoundsMulter = multer({
  storage: storageAchievementStagesSounds,
  fileFilter: filterMp3
}).array("uploaded_file");

export const getManyAchievementStages = async (
  req: Request<{}, {}, {}, RequestSearch>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50, sortBy = "createdAt", sortOrder = "desc" } = req.query;

  const searchFilter = filterAchievementStagesByUrlParams(req.query);
  try {
    const affixes = await getAchievementStages(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 }
    });

    const count = await getAchievementStagesCount(searchFilter);

    return res.status(200).send({
      data: affixes,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    logger.error(`Error when trying to getManyAchievementStages: ${err}`);
    next(err);
  }
};

export const deleteAchievementStageById = async (
  req: Request<RequestParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    await deleteAchievementStageByIdService(id);

    return res.status(200).send({ message: "Achievement stage deleted successfully" });
  } catch (err) {
    logger.error(`Error when trying to deleteAchievementStageById by id: ${id}: ${err}`);
    next(err);
  }
};

export const getAchievementStageById = async (
  req: Request<RequestParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const achievementStage = await getAchievementStagesById(id, { select: { __v: 0 } }, { stageDataBadge: true });

    const foundAchievementStage = checkExistResource(achievementStage, "Achievement stage");
    return res.status(200).send({ data: foundAchievementStage });
  } catch (err) {
    logger.error(`Error when trying to getAchievementStageById by id: ${id}: ${err}`);

    next(err);
  }
};

export const editAchievementStageById = async (
  req: Request<RequestParams, {}, AchievementStageUpdateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, stageData } = req.body;
  const updateData = { name, stageData };
  //TODO: add handling for rarirty 1-10
  try {
    const updatedAchievementStage = await updateOneAchievementStage({ _id: id }, updateData);

    const foundAchievementStage = checkExistResource(updatedAchievementStage, "Achievement stage");
    return res.status(200).send({
      message: "Badge updated successfully",
      data: foundAchievementStage
    });
  } catch (err) {
    logger.error(`Error when trying to editAchievementStageById by id: ${id}: ${err}`);
    next(err);
  }
};

export const getAchievementStageSoundsBaseUrl = (req: Request, res: Response) => {
  return res.status(200).send({ data: path.relative(publicPath, achievementsStagesSoundsPath) });
};

export const getAchievementStageSoundsList = (req: Request, res: Response, next: NextFunction) => {
  try {
    getListOfFilesWithExtensionInFolder(
      achievementsStagesSoundsPath,
      [".mp3"],
      (soundsPaths) => {
        return res.status(200).send({ data: soundsPaths });
      },
      (errorMsg) => {
        return next(new AppError(400, errorMsg));
      }
    );
  } catch (err) {
    logger.error(`Error when trying to getAchievementStageSoundsList: ${err}`);
    next(err);
  }
};

export const deleteAchievementStageSoundById = async (req: Request, res: Response, next: NextFunction) => {
  const { soundName } = req.params;

  try {
    const message = await deleteAchievementSound(soundName);
    return res.status(200).send({ message });
  } catch (err) {
    logger.error(`Error when trying to delete achievement sound ${soundName}: ${err}`);
    next(err);
  }
};

export const uploadAchievementStageSounds = (req: Request, res: Response, next: NextFunction) => {
  //TODO:add LIMIT for image size like 256/512/?? or sth
  try {
    uploadAchievementStageSoundsMulter(req, res, function (err) {
      if (err) {
        return next(err);
      }

      return res.status(200).send({ message: "Achievement sounds files updated successfully" });
    });
  } catch (err) {
    logger.error(`Error when trying to uploadAchievementStageSounds files ${err}`);
    next(err);
  }
};

export const addNewAchievementStage = async (
  req: Request<{}, {}, AchievementStageCreateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { name, stageData } = req.body;
  const createData = { name, stageData };

  try {
    const newBadge = await createAchievementStage(createData);

    return res.status(200).send({ message: "Achievement stage added successfully", badge: newBadge });
  } catch (err) {
    logger.error(`Error when trying to addNewAchievementStage ${err}`);
    next(err);
  }
};
