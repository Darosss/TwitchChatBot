import { NextFunction, Request, Response } from "express";
import { badgesPath, publicPath } from "@configs";
import {
  BadgeCreateData,
  BadgeUpdateData,
  createBadge,
  getBadges,
  getBadgesCount,
  updateBadgeById,
  deleteBadgeById as deleteBadgeByIdService,
  deleteBadgeImage,
  getBadgeById as getBadgeByIdService
} from "@services";
import { RequestParams, RequestSearch } from "@types";
import { AppError, checkExistResource, filterImage, getListOfFilesWithExtensionInFolder, logger } from "@utils";
import multer from "multer";
import { filterBadgesByUrlParams } from "./filters/badgesFilter";
import path from "path";

const storageImageBadges = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, badgesPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const uploadBadgeImagesMulter = multer({
  storage: storageImageBadges,
  fileFilter: filterImage
}).array("uploaded_file");

export const getManyBadges = async (req: Request<{}, {}, {}, RequestSearch>, res: Response, next: NextFunction) => {
  const { page = 1, limit = 50, sortBy = "createdAt", sortOrder = "desc" } = req.query;

  const searchFilter = filterBadgesByUrlParams(req.query);
  try {
    const affixes = await getBadges(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 }
    });

    const count = await getBadgesCount(searchFilter);

    return res.status(200).send({
      data: affixes,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    logger.error(`Error when trying to getManyBadges: ${err}`);

    next(err);
  }
};
export const uploadBadgeImages = (req: Request, res: Response, next: NextFunction) => {
  //TODO:add LIMIT for image size like 256/512/?? or sth
  try {
    uploadBadgeImagesMulter(req, res, function (err) {
      if (err) {
        return next(err);
      }

      return res.status(200).send({ message: "Badge images files updated successfully" });
    });
  } catch (err) {
    logger.error(`Error when trying to uploadBadgeImages files: ${err}`);
    next(err);
  }
};

export const deleteBadgeImageByName = async (req: Request, res: Response, next: NextFunction) => {
  const { badgeName } = req.params;

  try {
    const message = await deleteBadgeImage(badgeName);
    return res.status(200).send({ message });
  } catch (err) {
    logger.error(`Error when trying to delete badge image ${badgeName}: ${err}`);
    next(err);
  }
};

export const getBadgesBaseUrl = (req: Request, res: Response) => {
  return res.status(200).send({ data: path.relative(publicPath, badgesPath) });
};

export const getBadgesImagesList = (req: Request, res: Response, next: NextFunction) => {
  try {
    getListOfFilesWithExtensionInFolder(
      badgesPath,
      [".jpg", ".jpeg", ".png", ".gif"],
      (imagesPaths) => {
        return res.status(200).send({ data: imagesPaths });
      },
      (errorMsg) => {
        return next(new AppError(400, errorMsg));
      }
    );
  } catch (err) {
    logger.error(`Error when trying to getBadgesImagesList: ${err}`);
    next(err);
  }
};

export const editBadgeById = async (
  req: Request<RequestParams, {}, BadgeUpdateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, imageUrl, description } = req.body;

  try {
    const updatedBadge = await updateBadgeById(id, {
      name,
      imageUrl,
      description
    });

    return res.status(200).send({
      message: "Badge updated successfully",
      data: updatedBadge
    });
  } catch (err) {
    logger.error(`Error when trying to editBadgeById: ${id} ${err}`);
    next(err);
  }
};

export const addNewBadge = async (req: Request<{}, {}, BadgeCreateData, {}>, res: Response, next: NextFunction) => {
  const { name, imageUrl, description } = req.body;

  try {
    const newBadge = await createBadge({ name, description, imageUrl });

    return res.status(200).send({ message: "Badge added successfully", badge: newBadge });
  } catch (err) {
    logger.error(`Error when trying to addNewBadge ${err}`);
    next(err);
  }
};

export const deleteBadgeById = async (req: Request<RequestParams, {}, {}, {}>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await deleteBadgeByIdService(id);

    return res.status(200).send({ message: "Badge deleted successfully" });
  } catch (err) {
    logger.error(`Error when trying to deleteBadgeById: ${id} ${err}`);
    next(err);
  }
};

export const getBadgeById = async (req: Request<RequestParams, {}, {}, {}>, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const badge = await getBadgeByIdService(id, { select: { __v: 0 } });

    const foundBadge = checkExistResource(badge, "Badge");
    return res.status(200).send({ data: foundBadge });
  } catch (err) {
    logger.error(`Error when trying to getBadgeById by id: ${id}: ${err}`);
    next(err);
  }
};
