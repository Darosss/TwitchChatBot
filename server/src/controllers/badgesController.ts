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
  deleteBadgeImages,
  getBadgeById as getBadgeByIdService,
  badgeModelIMagesUrlsSizesNumbers,
  SEPARATOR_BADGE_IMAGE_SIZE
} from "@services";
import { RequestParams, RequestSearch } from "@types";
import {
  AppError,
  checkExistResource,
  filterImage,
  getFileNameAndExtension,
  getListOfFilesWithExtensionInFolder,
  logger
} from "@utils";
import multer from "multer";
import { filterBadgesByUrlParams } from "./filters/badgesFilter";
import path from "path";
import sharp from "sharp";

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
  const resize = async (
    filePath: string,
    size: number,
    destination: string,
    fileName: string,
    extensionWithDot: string,
    sharpOptions?: sharp.SharpOptions
  ) =>
    await sharp(filePath, sharpOptions)
      .resize(size, size, { fit: "fill" })
      .toFile(`${destination}\\${fileName}${SEPARATOR_BADGE_IMAGE_SIZE}${size}${extensionWithDot}`);

  try {
    uploadBadgeImagesMulter(req, res, async function (err) {
      if (err) {
        return next(err);
      }
      if (req.files) {
        sharp.cache(false);

        const files = req.files as Express.Multer.File[];
        const imageSizes = badgeModelIMagesUrlsSizesNumbers;

        files.forEach(async (file, index) => {
          const { fileName, extension } = getFileNameAndExtension(file.filename);
          const isAGifFile = extension.includes("gif");

          await Promise.all(
            imageSizes.map((val) =>
              resize(file.path, Number(val), file.destination, fileName, extension, {
                //if gif file make sure we resize animation
                ...(isAGifFile && { animated: true, pages: -1 })
              })
            )
          );
          //if last file is resized return message
          if (index === files.length - 1)
            return res.status(200).send({ message: "Badge images files resized and updated successfully" });
        });
      }
    });
  } catch (err) {
    logger.error(`Error when trying to uploadBadgeImages files: ${err}`);
    next(err);
  }
};

export const deleteBadgeImageByName = async (req: Request, res: Response, next: NextFunction) => {
  const { badgeName } = req.params;

  const { fileName, extension } = getFileNameAndExtension(badgeName);

  const deleteFilter = { name: fileName, extension, sizesToDelete: badgeModelIMagesUrlsSizesNumbers };
  try {
    const message = await deleteBadgeImages(deleteFilter);
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
        const onlyOriginalImagesPaths = imagesPaths
          .filter((path) => !path.includes(SEPARATOR_BADGE_IMAGE_SIZE))
          .map((path) => {
            const { fileName, extension } = getFileNameAndExtension(path);
            return [fileName, extension];
          });

        return res.status(200).send({
          data: {
            //thats for show for user only x128px
            imagesPaths: onlyOriginalImagesPaths,
            separatorSizes: SEPARATOR_BADGE_IMAGE_SIZE,
            availableSizes: badgeModelIMagesUrlsSizesNumbers
          }
        });
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
  const { name, imagesUrls, description } = req.body;

  const updateData = { name, imagesUrls, description };
  try {
    const updatedBadge = await updateBadgeById(id, updateData);

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
  const { name, imagesUrls, description } = req.body;

  const createData = { name, imagesUrls, description };
  try {
    const newBadge = await createBadge(createData);

    return res.status(200).send({ message: "Badge added successfully", data: newBadge });
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
