import Express, { Request, Response } from "express";
import { IRequestTriggerQuery } from "@types";
import { Trigger } from "@models/trigger.model";
import { filterTriggersByUrlParams } from "./filters/triggers.filter";

const getTriggers = async (
  req: Request<{}, {}, {}, IRequestTriggerQuery>,
  res: Response
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterTriggersByUrlParams(req.query);
  try {
    const triggers = await Trigger.find(searchFilter)
      .limit(limit * 1)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .select({ __v: 0 })
      .exec();

    const count = await Trigger.countDocuments(searchFilter);

    res.status(200).send({
      triggers,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({ message: "Couldn't get triggers" });
  }
};

const addNewTrigger = async (req: Request, res: Response) => {
  const { name, chance, delay, words, messages, enabled = true } = req.body;

  try {
    await new Trigger({
      name: name,
      chance: chance,
      enabled: enabled,
      delay: delay,
      messages: messages,
      words: words,
    }).save();
    res.status(200).send({ message: "Added successfully" });
  } catch (error) {
    res.status(400).send({ message: "Couldn't add trigger" });
  }
};

const editTriggerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, chance, delay, words, messages, enabled = true } = req.body;

  try {
    await Trigger.findByIdAndUpdate(id, {
      name: name,
      chance: chance,
      enabled: enabled,
      delay: delay,
      messages: messages,
      words: words,
    });
    res.status(200).send({ message: "Updated successfully" });
  } catch (error) {
    res.status(400).send({ message: "Couldn't update trigger" });
  }
};

const deleteTrigger = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await Trigger.findByIdAndDelete(id);
    res.status(200).send({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).send({ message: "Couldn't delete trigger" });
  }
};

export { getTriggers, addNewTrigger, editTriggerById, deleteTrigger };
