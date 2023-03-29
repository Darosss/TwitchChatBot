import Express, { NextFunction, Request, Response } from "express";
import { RequestSearch } from "@types";
import { filterTagsByUrlParams } from "./filters/tagsFilter";
import {
  createTag,
  deleteTagById,
  getTags,
  getTagsCount,
  updateTagById,
} from "@services/tags";

export const getTagsList = async (
  req: Request<{}, {}, {}, RequestSearch>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterTagsByUrlParams(req.query);
  try {
    const tags = await getTags(searchFilter, {
      limit: limit,
      skip: page,
      sort: { createdAt: -1 },
    });

    const count = await getTagsCount(searchFilter);

    return res.status(200).send({
      data: tags,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

export const addNewTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  try {
    const newTag = await createTag({ name: name });

    return res
      .status(200)
      .send({ message: "Tag added successfully", tag: newTag });
  } catch (err) {
    next(err);
  }
};

export const editTagById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, enabled } = req.body;

  try {
    const updatedTag = await updateTagById(id, {
      name: name,
      enabled: enabled,
    });

    return res.status(200).send({
      message: "Tag updated successfully",
      data: updatedTag,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedTag = await deleteTagById(id);

    return res.status(200).send({ message: "Tag deleted successfully" });
  } catch (err) {
    next(err);
  }
};
