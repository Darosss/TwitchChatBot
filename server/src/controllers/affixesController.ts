import Express, { NextFunction, Request, Response } from "express";
import { RequestParams, RequestSearch } from "@types";
import { filterAffixesByUrlParams } from "./filters/affixesFilter";
import {
  createAffix,
  deleteAffixById,
  getAffixes,
  getAffixesCount,
  updateAffixById,
} from "@services/affixes";
import { AffixCreateData, AffixUpdateData } from "@services/affixes/types";
import { AffixModel } from "@models/types";

export const getAffixesList = async (
  req: Request<{}, {}, {}, RequestSearch<AffixModel>>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterAffixesByUrlParams(req.query);
  try {
    const affixes = await getAffixes(searchFilter, {
      limit: limit,
      skip: page,
      sort: { createdAt: -1 },
    });

    const count = await getAffixesCount(searchFilter);

    return res.status(200).send({
      data: affixes,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

export const addNewAffix = async (
  req: Request<{}, {}, AffixCreateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  try {
    const newAffix = await createAffix({ name: name });

    return res.status(200).send({
      message: "Affix added successfully",
      affix: newAffix,
    });
  } catch (err) {
    next(err);
  }
};

export const editAffixById = async (
  req: Request<RequestParams, {}, AffixUpdateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, enabled } = req.body;

  try {
    const updatedAffix = await updateAffixById(id, {
      name: name,
      enabled: enabled,
    });

    return res.status(200).send({
      message: "Affix updated successfully",
      data: updatedAffix,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAffix = async (
  req: Request<RequestParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedAffix = await deleteAffixById(id);

    return res.status(200).send({ message: "Affix deleted successfully" });
  } catch (err) {
    next(err);
  }
};