import { Badge, BadgeDocument, BadgeModelImagesUrlsSizes } from "@models";
import { AppError, checkExistResource, handleAppError, logger } from "@utils";
import {
  BadgeCreateData,
  BadgeFindOptions,
  BadgeUpdateData,
  DeleteBadgeImagesFn,
  ManyBadgesFindOptions
} from "./types";
import { FilterQuery, UpdateQuery } from "mongoose";
import { getAchievementStages } from "@services";
import { promises as fsPromises } from "fs";
import path from "path";
import { badgesPath } from "@configs";

export const SEPARATOR_BADGE_IMAGE_SIZE = `-xSize-`;
export const badgeModelIMagesUrlsSizesNumbers = Object.values(BadgeModelImagesUrlsSizes).filter(Number) as number[];

export const getBadges = async (filter: FilterQuery<BadgeDocument> = {}, findOptions: ManyBadgesFindOptions) => {
  const { limit = 50, skip = 1, sort = { createdAt: -1 }, select = { __v: 0 } } = findOptions;

  try {
    const affix = await Badge.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .sort(sort);

    return affix;
  } catch (err) {
    logger.error(`Error occured while getting badges. ${err}`);
    handleAppError(err);
  }
};

export const getBadgesCount = async (filter: FilterQuery<BadgeDocument> = {}) => {
  return await Badge.countDocuments(filter);
};

export const createBadge = async (createData: BadgeCreateData) => {
  try {
    const createdBadge = await Badge.create(createData);

    if (!createdBadge) {
      throw new AppError(400, "Couldn't create new badge");
    }
    return createdBadge;
  } catch (err) {
    logger.error(`Error occured while creating badge. ${err}`);
    handleAppError(err);
  }
};

export const getBadgeById = async (id: string, findOptions: BadgeFindOptions) => {
  const { select = { __v: 0 } } = findOptions;

  try {
    const foundBadge = await Badge.findById(id).select(select);

    const streamSession = checkExistResource(foundBadge, `Stream session with id(${id})`);

    return streamSession;
  } catch (err) {
    logger.error(`Error occured while getting stream session by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const updateBadgeById = async (id: string, updateData: UpdateQuery<BadgeUpdateData>) => {
  try {
    const updatedBadge = await Badge.findByIdAndUpdate(id, updateData, {
      new: true
    });

    const badge = checkExistResource(updatedBadge, `Badge with id(${id})`);

    return badge;
  } catch (err) {
    logger.error(`Error occured while editing badge by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const deleteBadgeById = async (id: string) => {
  try {
    const countBadgesInStages = (await getAchievementStages({ "stageData.badge": id }, {})) || [];

    if (countBadgesInStages.length > 0) {
      throw new AppError(
        409,
        `Badge with id(${id}) is used in stage(s): [${countBadgesInStages
          .map(({ name }) => name)
          .join(", ")}], cannot delete`
      );
    }

    await Badge.findByIdAndDelete(id);

    return { message: "Successfully deleted badge" };
  } catch (err) {
    logger.error(`Error occured while deleting badge by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const deleteBadgeImages: DeleteBadgeImagesFn = async ({ name, extension, sizesToDelete }) => {
  try {
    const foundContainingBadges = (await getBadges({ imageUrl: { $regex: name, $options: "i" } }, {})) || [];
    if (foundContainingBadges.length > 0) {
      throw new AppError(
        409,
        `At least one badge image with name: (${name}) is used in badge(s): [${foundContainingBadges
          .map(({ name }) => name)
          .join(", ")}], cannot delete`
      );
    }

    //delete original
    await fsPromises.unlink(path.join(badgesPath, name + extension));

    //delete other sizes;
    for await (const size of sizesToDelete) {
      const fileName = name + SEPARATOR_BADGE_IMAGE_SIZE + String(size) + extension;
      const filePath = path.join(badgesPath, fileName);

      await fsPromises.unlink(filePath);
    }

    return `Badge images ${name} deleted successfully`;
  } catch (err) {
    logger.error(`Error occured while deleting badge image by name(${name}). ${err}`);
    handleAppError(err);
  }
};
