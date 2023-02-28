import { ChatCommand } from "@models/chatCommandModel";
import { IChatCommandDocument } from "@models/types";
import { checkExistResource } from "@utils/checkExistResourceUtil";
import { AppError, handleAppError } from "@utils/ErrorHandlerUtil";
import { logger } from "@utils/loggerUtil";
import { FilterQuery, UpdateQuery } from "mongoose";
import {
  ChatCommandCreateData,
  ChatCommandsFindOptions,
  ChatCommandUpdateData,
  ManyChatCommandsFindOptions,
} from "./types/";

export const getChatCommands = async (
  filter: FilterQuery<IChatCommandDocument> = {},
  chatCommandsFindOptions: ManyChatCommandsFindOptions
) => {
  const {
    limit = 50,
    skip = 1,
    sort = { createdAt: -1 },
    select = { __v: 0 },
  } = chatCommandsFindOptions;

  try {
    const chatCommands = await ChatCommand.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
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

export const getOneChatCommand = async (
  filter: FilterQuery<IChatCommandDocument> = {}
) => {
  try {
    const foundChatCommand = await ChatCommand.findOne(filter);

    const chatCommand = checkExistResource(foundChatCommand, "Chat command");

    return chatCommand;
  } catch (err) {
    logger.error(`Error occured while getting all chat commands: ${err}`);
    handleAppError(err);
  }
};

export const getChatCommandsCount = async (
  filter: FilterQuery<IChatCommandDocument> = {}
) => {
  return await ChatCommand.countDocuments(filter);
};

export const createChatCommand = async (
  createData: ChatCommandCreateData | ChatCommandCreateData[]
) => {
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

export const getChatCommandById = async (
  id: string,
  chatCommandFindOptions: ChatCommandsFindOptions
) => {
  const { select = { __v: 0 } } = chatCommandFindOptions;

  try {
    const foundChatCommand = await ChatCommand.findById(id).select(select);

    const chatCommand = checkExistResource(
      foundChatCommand,
      `Chat command with id(${id})`
    );

    return chatCommand;
  } catch (err) {
    logger.error(
      `Error occured while getting chat command with id(${id}): ${err}`
    );
    handleAppError(err);
  }
};

export const updateChatCommandById = async (
  id: string,
  updateData: UpdateQuery<ChatCommandUpdateData>
) => {
  try {
    const updatedChatCommand = await ChatCommand.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );

    const chatCommand = checkExistResource(
      updatedChatCommand,
      `Chat command with id(${id})`
    );

    return chatCommand;
  } catch (err) {
    logger.error(
      `Error occured while editing chat command with id(${id}): ${err}`
    );
    handleAppError(err);
  }
};

export const updateChatCommands = async (
  filter: FilterQuery<IChatCommandDocument>,
  updateData: UpdateQuery<ChatCommandUpdateData>
) => {
  try {
    const updatedChatCommand = await ChatCommand.findOneAndUpdate(
      filter,
      updateData,
      {
        new: true,
      }
    );

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

    const chatCommand = checkExistResource(
      deletedChatCommand,
      `Chat command with id(${id})`
    );

    return chatCommand;
  } catch (err) {
    logger.error(
      `Error occured while deleting chat command with id(${id}) : ${err}`
    );
    handleAppError(err);
  }
};
