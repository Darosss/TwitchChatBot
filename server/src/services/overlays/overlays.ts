import { Overlay, OverlayDocument } from "@models";
import { AppError, handleAppError, checkExistResource, logger } from "@utils";
import { FilterQuery, UpdateQuery } from "mongoose";
import { OverlayCreateData, OverlaysFindOptions, OverlayUpdateData, ManyOverlaysFindOptions } from "./types/";

export const getOverlays = async (filter: FilterQuery<OverlayDocument> = {}, findOptions: ManyOverlaysFindOptions) => {
  const { limit = 50, skip = 1, sort = { createdAt: -1 }, select = { __v: 0 } } = findOptions;

  try {
    const overlay = await Overlay.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .sort(sort);

    return overlay;
  } catch (err) {
    logger.error(`Error occured while getting overlays: ${err}`);
    throw new AppError(500);
  }
};

export const getOverlaysCount = async (filter: FilterQuery<OverlayDocument> = {}) => {
  return await Overlay.countDocuments(filter);
};

export const createOverlay = async (createData: OverlayCreateData | OverlayCreateData[]) => {
  try {
    const createdOverlay = await Overlay.create(createData);

    if (!createdOverlay) {
      throw new AppError(400, "Couldn't create overlay");
    }

    return createdOverlay;
  } catch (err) {
    logger.error(`Error occured while creating overlays: ${err}`);
    handleAppError(err);
  }
};

export const getOverlayById = async (id: string, findOptions: OverlaysFindOptions) => {
  const { select = { __v: 0 } } = findOptions;

  try {
    const foundOverlay = await Overlay.findById(id).select(select);

    const overlay = checkExistResource(foundOverlay, `Overlay with id(${id})`);

    return overlay;
  } catch (err) {
    logger.error(`Error occured while getting overlaywith id(${id}): ${err}`);
    handleAppError(err);
  }
};

export const updateOverlayById = async (id: string, updateData: UpdateQuery<OverlayUpdateData>) => {
  try {
    const updatedOverlay = await Overlay.findByIdAndUpdate(id, updateData, {
      new: true
    });

    const overlay = checkExistResource(updatedOverlay, `Overlay with id(${id})`);

    return overlay;
  } catch (err) {
    logger.error(`Error occured while editing overlaywith id(${id}): ${err}`);
    handleAppError(err);
  }
};

export const deleteOverlayById = async (id: string) => {
  try {
    const deletedOverlay = await Overlay.findByIdAndDelete(id);

    const overlay = checkExistResource(deletedOverlay, `Overlay with id(${id})`);

    return overlay;
  } catch (err) {
    logger.error(`Error occured while deleting overlaywith id(${id}) : ${err}`);
    handleAppError(err);
  }
};
