import Express, { NextFunction, Request, Response } from "express";
import { RequestParams, RequestSearch } from "@types";
import { filterPersonalitiesByUrlParams } from "./filters/personalitiesFilter";
import {
  createPersonality,
  deletePersonalityById,
  getPersonalities,
  getPersonalitiesCount,
  updatePersonalityById,
} from "@services/personalities";
import {
  PersonalityCreateData,
  PersonalityUpdateData,
} from "@services/personalities/types";
import { PersonalityModel } from "@models/types";

export const getPersonalitiesList = async (
  req: Request<{}, {}, {}, RequestSearch<PersonalityModel>>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterPersonalitiesByUrlParams(req.query);
  try {
    const personalities = await getPersonalities(searchFilter, {
      limit: limit,
      skip: page,
      sort: { createdAt: -1 },
    });

    const count = await getPersonalitiesCount(searchFilter);

    return res.status(200).send({
      data: personalities,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

export const addNewPersonality = async (
  req: Request<{}, {}, PersonalityCreateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  try {
    const newPersonality = await createPersonality({ name: name });

    return res.status(200).send({
      message: "Personality added successfully",
      personality: newPersonality,
    });
  } catch (err) {
    next(err);
  }
};

export const editPersonalityById = async (
  req: Request<RequestParams, {}, PersonalityUpdateData, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, enabled } = req.body;

  try {
    const updatedPersonality = await updatePersonalityById(id, {
      name: name,
      enabled: enabled,
    });

    return res.status(200).send({
      message: "Personality updated successfully",
      data: updatedPersonality,
    });
  } catch (err) {
    next(err);
  }
};

export const deletePersonality = async (
  req: Request<RequestParams, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedPersonality = await deletePersonalityById(id);

    return res
      .status(200)
      .send({ message: "Personality deleted successfully" });
  } catch (err) {
    next(err);
  }
};
