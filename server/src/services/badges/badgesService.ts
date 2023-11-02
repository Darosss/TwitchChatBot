import { Badge, BadgeDocument } from "@models";
import { AppError, checkExistResource, handleAppError, logger } from "@utils";
import { BadgeCreateData, BadgeFindOptions } from "./types";
import { FilterQuery } from "mongoose";

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

export const getBadgeById = async (id: string, streamSessionFindOptions: BadgeFindOptions) => {
  const { select = { __v: 0 } } = streamSessionFindOptions;

  try {
    const foundBadge = await Badge.findById(id).select(select);

    const streamSession = checkExistResource(foundBadge, `Stream session with id(${id})`);

    return streamSession;
  } catch (err) {
    logger.error(`Error occured while getting stream session by id(${id}). ${err}`);
    handleAppError(err);
  }
};
