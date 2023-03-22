import Express, { NextFunction, Request, Response } from "express";
import { RequestCommandsQuery } from "@types";
import { filterCommandsByUrlParams } from "./filters/commandsFilter";
import {
  createChatCommand,
  deleteChatCommandById,
  getChatCommands,
  getChatCommandsCount,
  updateChatCommandById,
} from "@services/chatCommands";

export const getChatCommandsList = async (
  req: Request<{}, {}, {}, RequestCommandsQuery>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 25 } = req.query;

  const searchFilter = filterCommandsByUrlParams(req.query);
  try {
    const chatCommands = await getChatCommands(searchFilter, {
      limit: limit,
      skip: page,
      sort: { createdAt: -1 },
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, enabled, aliases, messages, privilege } = req.body;

  try {
    const newChatCommand = await createChatCommand({
      name: name,
      description: description,
      enabled: enabled,
      aliases: aliases,
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, description, enabled, aliases, messages, privilege } = req.body;

  try {
    const updatedChatCommand = await updateChatCommandById(id, {
      name: name,
      description: description,
      enabled: enabled,
      aliases: aliases,
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
  req: Request,
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
