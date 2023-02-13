import { ChatCommand } from "@models/chat-command.model";
import { IChatCommandDocument } from "@models/types";
import { FilterQuery, UpdateQuery } from "mongoose";
import {
  ChatCommandCreateData,
  ChatCommandsFindOptions,
  ChatCommandUpdateData,
  ManyChatCommandsFindOptions,
} from "./types/ChatCommand";

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

  const chatCommands = await ChatCommand.find(filter)
    .limit(limit * 1)
    .skip((skip - 1) * limit)
    .select(select)
    .sort(sort);

  return chatCommands;
};

export const getChatCommandsCount = async (
  filter: FilterQuery<IChatCommandDocument> = {}
) => {
  return await ChatCommand.countDocuments(filter);
};

export const createChatCommand = async (createData: ChatCommandCreateData) => {
  try {
    const chatCommand = await ChatCommand.create(createData);
    return chatCommand;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create chat command");
  }
};

export const getChatCommandById = async (
  id: string,
  chatCommandFindOptions: ChatCommandsFindOptions
) => {
  const { select = { __v: 0 } } = chatCommandFindOptions;

  const chatCommand = await ChatCommand.findById(id).select(select);

  return chatCommand;
};

export const updateChatCommandById = async (
  id: string,
  updateData: UpdateQuery<ChatCommandUpdateData>
) => {
  try {
    const chatCommand = await ChatCommand.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return chatCommand;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update chat command");
  }
};

export const updateChatCommands = async (
  filter: FilterQuery<IChatCommandDocument>,
  updateData: UpdateQuery<ChatCommandUpdateData>
) => {
  try {
    const chatCommand = await ChatCommand.findOneAndUpdate(filter, updateData, {
      new: true,
    });
    return chatCommand;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update chat command");
  }
};

export const deleteChatCommandById = async (id: string) => {
  try {
    return await ChatCommand.findByIdAndDelete(id);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update chat command");
  }
};
