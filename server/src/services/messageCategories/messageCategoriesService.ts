import { MessageCategory } from "@models/messageCategoryModel";
import { IMessageCategory } from "@models/types";
import { checkExistResource } from "@utils/checkExistResourceUtil";
import { handleAppError } from "@utils/ErrorHandlerUtil";
import { logger } from "@utils/loggerUtil";
import { randomWithMax } from "@utils/randomNumbersUtil";
import { FilterQuery, UpdateQuery } from "mongoose";
import {
  IManyMessageCategoriesFindOptions,
  IMessageCategoryData,
  IMessageCategoryFindOptions,
} from "./types";

export const getMessageCategories = async (
  filter: FilterQuery<IMessageCategory> = {},
  categoriesFindOptions: IManyMessageCategoriesFindOptions
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
  filter: FilterQuery<IMessageCategory>
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

export const getRandomCategoryMessage = async () => {
  const countCategories = await getMessageCategoriesCount({});
  var skipRandom = Math.floor(Math.random() * countCategories);

  try {
    const foundMessageCategory = await MessageCategory.findOne().skip(
      skipRandom
    );

    const category = checkExistResource(
      foundMessageCategory,
      "Message category"
    );

    return category;
  } catch (err) {
    logger.error(`Error occured while getting random message category: ${err}`);
    handleAppError(err);
  }
};

export const getRandomMessageFromCategory = async (
  messageCategory: IMessageCategory
) => {
  const { messages } = messageCategory;
  return messages[randomWithMax(messages.length)];
};

export const createMessageCategories = async (
  messageCategoryData: IMessageCategoryData | IMessageCategoryData[]
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
  filter: IMessageCategoryFindOptions,
  messageCategoryData: IMessageCategoryData
) => {};

export const updateMessageCategoryById = async (
  id: string,
  updateData: UpdateQuery<IMessageCategoryData>
) => {
  try {
    const updatedMessageCategory = await MessageCategory.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
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
