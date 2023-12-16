import { NextFunction, Request, Response } from "express";
import { RequestCommandsQuery, RequestParams } from "@types";
import { filterCommandsByUrlParams } from "./filters";
import {
  createChatCommand,
  deleteChatCommandById,
  getChatCommands,
  getChatCommandsCount,
  updateChatCommandById,
  ChatCommandCreateData,
  ChatCommandUpdateData
} from "@services";

export const getChatCommandsList = async (
  req: Request<{}, {}, {}, RequestCommandsQuery>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 25, sortBy = "createdAt", sortOrder = "desc" } = req.query;

  const searchFilter = filterCommandsByUrlParams(req.query);
  try {
    const chatCommands = await getChatCommands(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      populate: [
        { path: "tag", select: { _id: 1, name: 1, enabled: 1 } },
        { path: "mood", select: { _id: 1, name: 1, enabled: 1 } }
      ],
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 }
    });

    const count = await getChatCommandsCount(searchFilter);
    return res.status(200).send({
      data: chatCommands,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
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
  const { name, description, enabled, aliases, messages, privilege, tag, mood } = req.body;

  const createData = { name, description, enabled, aliases, tag, mood, messages, privilege };
  try {
    const newChatCommand = await createChatCommand(createData);

    return res.status(201).send({ message: "Chat command added successfully", data: newChatCommand });
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
  const { name, description, enabled, aliases, messages, privilege, tag, mood } = req.body;

  const updateData = { name, description, enabled, aliases, tag, mood, messages, privilege };

  try {
    const updatedChatCommand = await updateChatCommandById(id, updateData);

    return res.status(200).send({
      message: "Chat command updated successfully",
      chatCommand: updatedChatCommand
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCommandById = async (req: Request<RequestParams, {}, {}, {}>, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    await deleteChatCommandById(id);

    return res.status(200).send({ message: "Chat command deleted successfully" });
  } catch (err) {
    next(err);
  }
};
