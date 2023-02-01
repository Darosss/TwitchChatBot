import Express, { Request, Response } from "express";
import { ChatCommand } from "@models/chat-command.model";

const getChatCommands = async (req: Request, res: Response) => {
  const { page = 1, limit = 25 } = req.query as unknown as {
    page: number;
    limit: number;
  };
  try {
    const chatCommands = await ChatCommand.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select({ __v: 0 })
      .sort({ name: 1 })
      .exec();

    const count = await ChatCommand.countDocuments();

    res.status(200).send({
      chatCommands,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({ message: "Couldn't get chat commands" });
  }
};

const addNewCommand = async (req: Request, res: Response) => {
  const { name, description, enabled, aliases, messages, privilege } = req.body;

  try {
    await new ChatCommand({
      name: name,
      description: description,
      enabled: enabled,
      aliases: aliases,
      messages: messages,
      privilage: privilege,
    }).save();
    res.status(200).send({ message: "Added successfully" });
  } catch (error) {
    res.status(400).send({ message: "Couldn't add command" });
  }
};

const editChatCommand = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, enabled, aliases, messages, privilege } = req.body;

  try {
    await ChatCommand.findByIdAndUpdate(id, {
      name: name,
      description: description,
      enabled: enabled,
      aliases: aliases,
      messages: messages,
      privilage: privilege,
    });
    res.status(200).send({ message: "Updated successfully" });
  } catch (error) {
    res.status(400).send({ message: "Couldn't update command" });
  }
};

const deleteChatCommand = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await ChatCommand.findByIdAndDelete(id);
    res.status(200).send({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).send({ message: "Couldn't delete command" });
  }
};

export { getChatCommands, addNewCommand, editChatCommand, deleteChatCommand };
