import { ChatCommand, ChatCommandDocument } from "@models";
import { checkExistResource, AppError, handleAppError, logger } from "@utils";
import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import {
  ChatCommandCreateData,
  ChatCommandsFindOptions,
  ChatCommandUpdateData,
  ManyChatCommandsFindOptions
} from "./types";
import { modesPipeline } from "../aggregations";

export const getChatCommands = async (
  filter: FilterQuery<ChatCommandDocument> = {},
  findOptions: ManyChatCommandsFindOptions
) => {
  const { limit = 50, skip = 1, sort = { createdAt: -1 }, select = { __v: 0 }, populate = [] } = findOptions;

  try {
    const chatCommands = await ChatCommand.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .populate(populate)
      .sort(sort);

    return chatCommands;
  } catch (err) {
    logger.error(`Error occured while getting chat commands: ${err}`);
    throw new AppError(500);
  }
};

export const getAllChatCommands = async () => {
  try {
    const chatCommands = await ChatCommand.find({});

    return chatCommands;
  } catch (err) {
    logger.error(`Error occured while getting all chat commands: ${err}`);
    throw new AppError(500);
  }
};

export const getOneChatCommand = async (filter: FilterQuery<ChatCommandDocument> = {}) => {
  try {
    const foundChatCommand = await ChatCommand.findOne(filter);

    // const chatCommand = checkExistResource(foundChatCommand, "Chat command");

    return foundChatCommand;
  } catch (err) {
    logger.error(`Error occured while getting chat command by alias: ${err}`);
    handleAppError(err);
  }
};

export const getChatCommandsCount = async (filter: FilterQuery<ChatCommandDocument> = {}) => {
  return await ChatCommand.countDocuments(filter);
};

export const createChatCommand = async (createData: ChatCommandCreateData | ChatCommandCreateData[]) => {
  try {
    const createdCommand = await ChatCommand.create(createData);

    if (!createdCommand) {
      throw new AppError(400, "Couldn't create chat commands");
    }

    return createdCommand;
  } catch (err) {
    logger.error(`Error occured while creating chat command(s): ${err}`);
    handleAppError(err);
  }
};

export const getChatCommandById = async (id: string, findOptions: ChatCommandsFindOptions) => {
  const { select = { __v: 0 } } = findOptions;

  try {
    const foundChatCommand = await ChatCommand.findById(id).select(select);

    const chatCommand = checkExistResource(foundChatCommand, `Chat command with id(${id})`);

    return chatCommand;
  } catch (err) {
    logger.error(`Error occured while getting chat command with id(${id}): ${err}`);
    handleAppError(err);
  }
};

export const updateChatCommandById = async (id: string, updateData: UpdateQuery<ChatCommandUpdateData>) => {
  try {
    const updatedChatCommand = await ChatCommand.findByIdAndUpdate(id, updateData, {
      new: true
    });

    const chatCommand = checkExistResource(updatedChatCommand, `Chat command with id(${id})`);

    return chatCommand;
  } catch (err) {
    logger.error(`Error occured while editing chat command with id(${id}): ${err}`);
    handleAppError(err);
  }
};

export const updateChatCommands = async (
  filter: FilterQuery<ChatCommandDocument>,
  updateData: UpdateQuery<ChatCommandUpdateData>
) => {
  try {
    const updatedChatCommand = await ChatCommand.findOneAndUpdate(filter, updateData, {
      new: true
    });

    const chatCommand = checkExistResource(updatedChatCommand, `Chat command`);

    return chatCommand;
  } catch (err) {
    logger.error(`Error occured while editing chat command : ${err}`);
    handleAppError(err);
  }
};

export const deleteChatCommandById = async (id: string) => {
  try {
    const deletedChatCommand = await ChatCommand.findByIdAndDelete(id);

    const chatCommand = checkExistResource(deletedChatCommand, `Chat command with id(${id})`);

    return chatCommand;
  } catch (err) {
    logger.error(`Error occured while deleting chat command with id(${id}) : ${err}`);
    handleAppError(err);
  }
};

export const getChatCommandsAliases = async (modesEnabled = false): Promise<string[] | undefined> => {
  try {
    const pipeline: PipelineStage[] = [
      { $match: { enabled: true } },
      { $group: { _id: null, aliases: { $push: "$aliases" } } },
      {
        $project: {
          aliases: {
            $reduce: {
              input: "$aliases",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] }
            }
          },
          _id: 0
        }
      },
      { $unwind: "$aliases" },
      { $addFields: { aliasesLower: { $toLower: "$aliases" } } },
      { $sort: { aliasesLower: 1 } },
      { $group: { _id: null, aliases: { $push: "$aliasesLower" } } },
      { $project: { _id: 0, aliases: 1 } }
    ];

    if (modesEnabled) {
      pipeline.unshift(...modesPipeline);
    }

    const commandsAliases = await ChatCommand.aggregate(pipeline);

    if (commandsAliases.length > 0) {
      return commandsAliases[0].aliases;
    }
    return [];
  } catch (err) {
    logger.error(`Error occured while aggregating chat commands for all aliases words: ${err}`);
    handleAppError(err);
  }
};
