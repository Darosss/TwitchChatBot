import { modesPipeline } from "@aggregations/modesPipeline";
import { MessageCategory } from "@models/messageCategoryModel";
import { MessageCategoryDocument, MessageCategoryModel } from "@models/types";
import { checkExistResource } from "@utils/checkExistResourceUtil";
import { handleAppError } from "@utils/ErrorHandlerUtil";
import { logger } from "@utils/loggerUtil";
import mongoose, { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import {
  ManyMessageCategoriesFindOptions,
  MessageCategoryCreateData,
  MessageCategoryData,
  MessageCategoryFindOptions,
} from "./types";
import { randomWithMax } from "@utils/randomNumbersUtil";
import { getLeastMessagePipeline } from "@aggregations/messageCategoriesPipeline";

export const getMessageCategories = async (
  filter: FilterQuery<MessageCategoryModel> = {},
  categoriesFindOptions: ManyMessageCategoriesFindOptions
) => {
  const {
    limit = 50,
    skip = 1,
    sort = {},
    select = { __v: 0 },
    populateSelect,
  } = categoriesFindOptions;
  try {
    const categories = await MessageCategory.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .populate(populateSelect)
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

export const getMessageCategoryById = async (
  id: string,
  categoryFindOptions: MessageCategoryFindOptions
) => {
  const { select = { __v: 0 } } = categoryFindOptions;
  try {
    const foundCategory = await MessageCategory.findById(id).select(select);

    return foundCategory;
  } catch (err) {
    logger.error(
      `Error occured while getting message category with id(${id}). ${err}`
    );
    handleAppError(err);
  }
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
    const pipeline: PipelineStage[] = [
      { $match: { enabled: true } },
      { $sample: { size: 1 } },
    ];

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

export const getLeastUsedMessagesFromMessageCategory = async (
  id: string,
  divideMessagesBy = 3
): Promise<string[]> => {
  const categorySortedMsgs = await MessageCategory.aggregate<{
    leastUsedMessages: string[];
  }>([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
    ...getLeastMessagePipeline(divideMessagesBy),
    {
      $project: {
        _id: 0,
        leastUsedMessages: {
          $map: {
            input: "$leastUsedMessages",
            as: "tuple",
            in: { $arrayElemAt: ["$$tuple", 0] },
          },
        },
      },
    },
  ]);

  if (categorySortedMsgs.length > 0) {
    return categorySortedMsgs[0].leastUsedMessages;
  } else {
    return [""];
  }
};

export const getLeastMessagesFromEnabledCategories = async (
  modesEnabled: boolean = false,
  divideMessagesBy = 3
): Promise<[string, string][]> => {
  const pipeline: PipelineStage[] = [
    { $match: { enabled: true } },
    ...getLeastMessagePipeline(divideMessagesBy),
    {
      $project: {
        _id: 0,
        leastUsedMessages: {
          $map: {
            input: "$leastUsedMessages",
            as: "tuple",
            in: [{ $arrayElemAt: ["$$tuple", 0] }, "$_id"],
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        leastUsedMessages: { $push: "$leastUsedMessages" },
      },
    },
    {
      $project: {
        leastUsedMessages: { $concatArrays: "$leastUsedMessages" },
      },
    },
  ];

  if (modesEnabled) {
    pipeline.unshift(...modesPipeline);
  }

  const categorySortedMsgs = await MessageCategory.aggregate<{
    leastUsedMessages: [string, string][][];
  }>(pipeline);
  if (categorySortedMsgs.length > 0) {
    return categorySortedMsgs[0].leastUsedMessages.flat(1);
  } else {
    return [["", ""]];
  }
};

export const createMessageCategories = async (
  messageCategoryData: MessageCategoryCreateData
) => {
  let modifiedCategoryData: MessageCategoryData = {
    ...messageCategoryData,
    messages: messageCategoryData.messages.map((msg) => [msg, 0]),
  };
  try {
    const messageCategory = await MessageCategory.create(modifiedCategoryData);
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
  updateData: UpdateQuery<MessageCategoryCreateData>
) => {
  let updateMessages = updateData.messages as string[];
  try {
    const newMessages = await compareUpdateMessagesWithExisting(
      id,
      updateMessages
    );

    const updatedMessageCategory = await MessageCategory.findByIdAndUpdate(
      id,
      { ...updateData, ...(updateMessages && { messages: newMessages }) },
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

export const findCategoryAndUpdateMessageUse = async (
  id: string,
  word: string
) => {
  console.log("updating");
  const updatedCategory = await MessageCategory.findOneAndUpdate(
    { _id: id, "messages.0": { $exists: true } },
    { $inc: { "messages.$[elem].1": 1 } },
    {
      arrayFilters: [{ "elem.0": word }],
      useFindAndModify: false,
      new: true,
    }
  );
  return updatedCategory;
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

const compareUpdateMessagesWithExisting = async (
  id: string,
  updateMessages: string[]
) => {
  const existingCategory = await getMessageCategoryById(id, {});
  const existingMessages = existingCategory?.messages;
  if (!existingCategory || !existingMessages) return;

  const newMessages: [string, number][] = [];

  updateMessages?.forEach((msg) => {
    const foundMsg = existingMessages.find((exMsg) => exMsg[0] === msg);
    if (!foundMsg) {
      newMessages.push([msg, 0]);
    } else {
      newMessages.push([msg, foundMsg[1]]);
    }
  });

  return newMessages;
};
