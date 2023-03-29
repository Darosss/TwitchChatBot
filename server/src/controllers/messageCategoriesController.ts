import Express, { NextFunction, Request, Response } from "express";
import {
  getMessageCategories,
  getMessageCategoriesCount,
  updateMessageCategoryById,
  createMessageCategories,
  deleteMessageCategory,
} from "@services/messageCategories";
import { RequestQueryMessageCategories } from "@types";
import { filterMessageCategoriesByUrlParams } from "./filters/messageCategoriesFilter";

export const getMessageCategoriesList = async (
  req: Request<{}, {}, {}, RequestQueryMessageCategories>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = await filterMessageCategoriesByUrlParams(req.query);

  try {
    const categories = await getMessageCategories(searchFilter, {
      limit: limit,
      skip: page,
      populateSelect: [
        { path: "personality", select: { _id: 1, name: 1, enabled: 1 } },
        { path: "tag", select: { _id: 1, name: 1, enabled: 1 } },
        { path: "mood", select: { _id: 1, name: 1, enabled: 1 } },
      ],
      sort: { uses: -1 },
      select: { __v: 0 },
    });

    const count = await getMessageCategoriesCount(searchFilter);
    return res.status(200).send({
      data: categories,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

export const editMessageCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, messages, tag, mood, personality } = req.body;

  try {
    const updatedCategoryMessage = await updateMessageCategoryById(id, {
      name: name,
      messages: messages,
      tag: tag,
      mood: mood,
      personality: personality,
    });

    return res.status(200).send({
      message: "Message category updated successfully",
      data: updatedCategoryMessage,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUsesCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const updatedCategoryMessage = await updateMessageCategoryById(id, {
      $inc: { uses: 1 },
    });

    return res.status(200).send({
      message: "Message category updated successfully",
      data: updatedCategoryMessage,
    });
  } catch (err) {
    next(err);
  }
};

export const addNewCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, messages, tag, mood, personality } = req.body;

  try {
    const newMessageCategory = await createMessageCategories({
      name: name,
      messages: messages,
      tag: tag,
      mood: mood,
      personality: personality,
    });

    return res.status(200).send({
      message: "Message category added successfully",
      messageCategory: newMessageCategory,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteMessageCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedMessageCategory = await deleteMessageCategory(id);

    return res
      .status(200)
      .send({ message: "Message category deleted successfully" });
  } catch (err) {
    next(err);
  }
};
