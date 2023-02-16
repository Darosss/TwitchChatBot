import Express, { Request, Response } from "express";
import { IRequestTriggerQuery } from "@types";
import { filterTriggersByUrlParams } from "./filters/triggers.filter";
import {
  createTrigger,
  deleteTriggerById,
  getTriggers,
  getTriggersCount,
  updateTriggerById,
} from "@services/Triggers";

const getTriggersList = async (
  req: Request<{}, {}, {}, IRequestTriggerQuery>,
  res: Response
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterTriggersByUrlParams(req.query);
  try {
    const triggers = await getTriggers(searchFilter, {
      limit: limit,
      skip: page,
      sort: { createdAt: -1 },
    });

    const count = await getTriggersCount(searchFilter);

    return res.status(200).send({
      data: triggers,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: "Internal server error" });
  }
};

const addNewTrigger = async (req: Request, res: Response) => {
  const { name, chance, delay, words, messages, enabled = true } = req.body;

  try {
    const newTrigger = await createTrigger({
      name: name,
      chance: chance,
      enabled: enabled,
      delay: delay,
      messages: messages,
      words: words,
    });

    return res
      .status(200)
      .send({ message: "Trigger added successfully", trigger: newTrigger });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: "Internal server error" });
  }
};

const editTriggerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, chance, delay, words, messages, enabled = true } = req.body;

  try {
    const updatedTrigger = await updateTriggerById(id, {
      name: name,
      chance: chance,
      enabled: enabled,
      delay: delay,
      messages: messages,
      words: words,
    });

    return res.status(200).send({
      message: "Trigger updated successfully",
      data: updatedTrigger,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: "Internal server error" });
  }
};

const deleteTrigger = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedTrigger = await deleteTriggerById(id);

    if (!deletedTrigger) {
      return res.status(404).send({ message: "Trigger not found" });
    }
    return res.status(200).send({ message: "Trigger deleted successfully" });
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: "Internal server error" });
  }
};

export { getTriggersList, addNewTrigger, editTriggerById, deleteTrigger };
