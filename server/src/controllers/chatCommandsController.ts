import Express, { NextFunction, Request, Response } from "express";
import { RequestCommandsQuery, RequestParams } from "@types";
import { filterCommandsByUrlParams } from "./filters/commandsFilter";
import {
  createChatCommand,
  deleteChatCommandById,
  getChatCommands,
  getChatCommandsCount,
  updateChatCommandById,
  ChatCommandCreateData,
  ChatCommandUpdateData,
} from "@services/chatCommands";

export const getChatCommandsList = async (
  req: Request<{}, {}, {}, RequestCommandsQuery>,
  res: Response,
  next: NextFunction
) => {
  const {
    page = 1,
    limit = 25,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const searchFilter = filterCommandsByUrlParams(req.query);
  try {
    const chatCommands = await getChatCommands(searchFilter, {
      limit: limit,
      skip: page,
      populateSelect: [
        { path: "tag", select: { _id: 1, name: 1, enabled: 1 } },
        { path: "mood", select: { _id: 1, name: 1, enabled: 1 } },
      ],
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
    });

    const count = await getChatCommandsCount(searchFilter);
    return res.status(200).send({
      data: chatCommands,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

export const addNewCommand = async (
  req: Request<{}, {}, ChatCommandCreateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    description,
    enabled,
    aliases,
    messages,
    privilege,
    tag,
    mood,
  } = req.body;

  try {
    const newChatCommand = await createChatCommand({
      name: name,
      description: description,
      enabled: enabled,
      aliases: aliases,
      tag: tag,
      mood: mood,
      messages: messages,
      privilege: privilege,
    });

    return res
      .status(201)
      .send({ message: "Added successfully", chatCommand: newChatCommand });
  } catch (err) {
    next(err);
  }
};

export const editChatCommandById = async (
  req: Request<RequestParams, {}, ChatCommandUpdateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const {
    name,
    description,
    enabled,
    aliases,
    messages,
    privilege,
    tag,
    mood,
  } = req.body;

  try {
    const updatedChatCommand = await updateChatCommandById(id, {
      name: name,
      description: description,
      enabled: enabled,
      aliases: aliases,
      tag: tag,
      mood: mood,
      messages: messages,
      privilege: privilege,
    });

    return res.status(200).send({
      message: "Updated successfully",
      chatCommand: updatedChatCommand,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCommandById = async (
  req: Request<RequestParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedChatCommand = await deleteChatCommandById(id);

    return res
      .status(200)
      .send({ message: "Chat command deleted successfully" });
  } catch (err) {
    next(err);
  }
};
