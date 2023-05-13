import { Tag } from "@models/tagModel";
import { TagDocument } from "@models/types";
import { getChatCommandsCount } from "@services/chatCommands";
import { getMessageCategoriesCount } from "@services/messageCategories";
import { getTimersCount } from "@services/timers";
import { getTriggersCount } from "@services/triggers";
import { checkExistResource } from "@utils/checkExistResourceUtil";
import { AppError, handleAppError } from "@utils/ErrorHandlerUtil";
import { logger } from "@utils/loggerUtil";
import { FilterQuery, UpdateQuery } from "mongoose";
import { ManyTagsFindOptions, TagCreateData, TagUpdateData } from "./types";

export const getTags = async (filter: FilterQuery<TagDocument> = {}, tagFindOptions: ManyTagsFindOptions) => {
  const { limit = 50, skip = 1, sort = { createdAt: -1 }, select = { __v: 0 } } = tagFindOptions;

  try {
    const tags = await Tag.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .sort(sort);

    return tags;
  } catch (err) {
    logger.error(`Error occured while getting tags. ${err}`);
    handleAppError(err);
  }
};

export const getTagsCount = async (filter: FilterQuery<TagDocument> = {}) => {
  return await Tag.countDocuments(filter);
};

export const createTag = async (createData: TagCreateData | TagCreateData[]) => {
  try {
    const createdTag = await Tag.create(createData);

    if (!createdTag) {
      throw new AppError(400, "Couldn't create new tag(s)");
    }
    return createdTag;
  } catch (err) {
    logger.error(`Error occured while creating tag(s). ${err}`);
    handleAppError(err);
  }
};

export const updateTags = async (filter: FilterQuery<TagDocument> = {}, updateData: UpdateQuery<TagUpdateData>) => {
  try {
    await Tag.updateMany(filter, updateData, {
      new: true
    });
  } catch (err) {
    logger.error(`Error occured while updating many tags. ${err}`);
    handleAppError(err);
  }
};

export const updateTagById = async (id: string, updateData: UpdateQuery<TagUpdateData>) => {
  try {
    const updatedTag = await Tag.findByIdAndUpdate(id, updateData, {
      new: true
    });

    const tag = checkExistResource(updatedTag, `Tag with id(${id})`);

    return tag;
  } catch (err) {
    logger.error(`Error occured while editing tag by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const deleteTagById = async (id: string) => {
  try {
    const filter = { tag: id };
    const countTagsInDocs = await Promise.all([
      getTriggersCount(filter),
      getChatCommandsCount(filter),
      getTimersCount(filter),
      getMessageCategoriesCount(filter)
    ]);

    if (countTagsInDocs.reduce((a, b) => a + b) > 0) {
      throw new AppError(409, `Tag with id(${id}) is used somewhere else, cannot delete`);
    }

    const deletedTag = await Tag.findByIdAndDelete(id);

    const tag = checkExistResource(deletedTag, `Tag with id(${id})`);

    return tag;
  } catch (err) {
    logger.error(`Error occured while deleting tag by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const getTagById = async (id: string, filter: FilterQuery<TagDocument> = {}) => {
  try {
    const foundTag = await Tag.findById(id, filter);

    const tag = checkExistResource(foundTag, `Tag with id(${id})`);

    return tag;
  } catch (err) {
    logger.error(`Error occured while getting tag: ${err}`);
    handleAppError(err);
  }
};

export const getOneTag = async (filter: FilterQuery<TagDocument> = {}) => {
  try {
    const foundTag = await Tag.findOne(filter);

    const tag = checkExistResource(foundTag, "Tag");

    return tag;
  } catch (err) {
    logger.error(`Error occured while getting tag: ${err}`);
    handleAppError(err);
  }
};
