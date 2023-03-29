import { modesPipeline } from "@aggregations/modesPipeline";
import { MessageCategory } from "@models/messageCategoryModel";
import { MessageCategoryDocument, MessageCategoryModel } from "@models/types";
import { checkExistResource } from "@utils/checkExistResourceUtil";
import { handleAppError } from "@utils/ErrorHandlerUtil";
import { logger } from "@utils/loggerUtil";
import { randomWithMax } from "@utils/randomNumbersUtil";
import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import {
  ManyMessageCategoriesFindOptions,
  MessageCategoryData,
  MessageCategoryFindOptions,
} from "./types";

export const getMessageCategories = async (
  filter: FilterQuery<MessageCategoryModel> = {},
  categoriesFindOptions: ManyMessageCategoriesFindOptions
) => {
  const {
    limit = 50,
    skip = 1,
    sort = {},
    select = { __v: 0 },
  } = categoriesFindOptions;
  try {
    const categories = await MessageCategory.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .sort(sort);

    return categories;
  } catch (err) {
    logger.error(`Error occured while getting message categories: ${err}`);
    handleAppError(err);
  }
};

export const getMessageCategoriesCount = async (
  filter: FilterQuery<MessageCategoryModel>
) => {
  const count = await MessageCategory.countDocuments(filter);
  return count;
};

export const getMessagesByCategory = async (category: string) => {
  try {
    const foundCategory = await MessageCategory.findOne({ category: category });

    const messageCategory = checkExistResource(
      foundCategory,
      `Message category ${category}`
    );

    return messageCategory.messages;
  } catch (err) {
    logger.error(
      `Error occured while getting messages from category ${category}: ${err}`
    );
    handleAppError(err);
  }
};

export const getRandomCategoryMessage = async (
  modesEnabled: boolean = false
) => {
  try {
    const pipeline: PipelineStage[] = [{ $sample: { size: 1 } }];

    if (modesEnabled) {
      pipeline.unshift(...modesPipeline);
    }
    const foundMessageCategory =
      await MessageCategory.aggregate<MessageCategoryDocument>(pipeline);
    if (foundMessageCategory.length > 0) {
      return foundMessageCategory[0];
    }
    return;
  } catch (err) {
    logger.error(`Error occured while getting random message category: ${err}`);
    handleAppError(err);
  }
};

export const getRandomMessageFromCategory = async (
  messageCategory: MessageCategoryModel
) => {
  const { messages } = messageCategory;
  return messages[randomWithMax(messages.length)];
};

export const createMessageCategories = async (
  messageCategoryData: MessageCategoryData | MessageCategoryData[]
) => {
  try {
    const messageCategory = await MessageCategory.create(messageCategoryData);
    return messageCategory;
  } catch (err) {
    logger.error(`Error occured while creating message category: ${err}`);
    handleAppError(err);
  }
};

export const updateMessageCategory = async (
  filter: MessageCategoryFindOptions,
  messageCategoryData: MessageCategoryData
) => {};

export const updateMessageCategoryById = async (
  id: string,
  updateData: UpdateQuery<MessageCategoryData>
) => {
  try {
    const updatedMessageCategory = await MessageCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    const messageCategory = checkExistResource(
      updatedMessageCategory,
      `Message category with id(${id})`
    );

    return messageCategory;
  } catch (err) {
    logger.error(
      `Error occured while editing message category by id(${id}). ${err}`
    );
    handleAppError(err);
  }
};

export const deleteMessageCategory = async (id: string) => {
  try {
    const deletedMessageCategory = await MessageCategory.findByIdAndDelete(id);

    const messageCategory = checkExistResource(
      deletedMessageCategory,
      `Message category with id(${id})`
    );

    return messageCategory;
  } catch (err) {
    logger.error(
      `Error occured while deleting message category by id(${id}). ${err}`
    );
    handleAppError(err);
  }
};
