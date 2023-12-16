import { NextFunction, Request, Response } from "express";
import {
  getMessageCategories,
  getMessageCategoriesCount,
  updateMessageCategoryById,
  createMessageCategories,
  deleteMessageCategory,
  MessageCategoryCreateData
} from "@services";
import { RequestParams, RequestQueryMessageCategories } from "@types";
import { filterMessageCategoriesByUrlParams } from "./filters";

export const getMessageCategoriesList = async (
  req: Request<{}, {}, {}, RequestQueryMessageCategories>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50, sortBy = "uses", sortOrder = "desc" } = req.query;

  const searchFilter = await filterMessageCategoriesByUrlParams(req.query);

  try {
    const categories = await getMessageCategories(searchFilter, {
      limit: Number(limit),
      skip: Number(page),
      populate: [
        { path: "tag", select: { _id: 1, name: 1, enabled: 1 } },
        { path: "mood", select: { _id: 1, name: 1, enabled: 1 } }
      ],
      sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
      select: { __v: 0 }
    });

    const count = await getMessageCategoriesCount(searchFilter);
    return res.status(200).send({
      data: categories,
      totalPages: Math.ceil(count / Number(limit)),
      count: count,
      currentPage: Number(page)
    });
  } catch (err) {
    next(err);
  }
};

export const editMessageCategoryById = async (
  req: Request<RequestParams, {}, MessageCategoryCreateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, messages, tag, mood, enabled } = req.body;

  const updateData = { name, messages, tag, mood, enabled };
  try {
    const updatedCategoryMessage = await updateMessageCategoryById(id, updateData);

    return res.status(200).send({
      message: "Message category updated successfully",
      data: updatedCategoryMessage
    });
  } catch (err) {
    next(err);
  }
};

export const updateUsesCategoryById = async (
  req: Request<RequestParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const updatedCategoryMessage = await updateMessageCategoryById(id, {
      $inc: { uses: 1 }
    });

    return res.status(200).send({
      message: "Message category updated successfully",
      data: updatedCategoryMessage
    });
  } catch (err) {
    next(err);
  }
};

export const addNewCategory = async (
  req: Request<{}, {}, MessageCategoryCreateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { name, messages, tag, mood, enabled } = req.body;

  const createData = { name, messages, enabled, tag, mood };
  try {
    const newMessageCategory = await createMessageCategories(createData);

    return res.status(200).send({
      message: "Message category added successfully",
      data: newMessageCategory
    });
  } catch (err) {
    next(err);
  }
};

export const deleteMessageCategoryById = async (
  req: Request<RequestParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    await deleteMessageCategory(id);

    return res.status(200).send({ message: "Message category deleted successfully" });
  } catch (err) {
    next(err);
  }
};
