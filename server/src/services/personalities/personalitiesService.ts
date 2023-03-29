import { Personality } from "@models/personalityModel";
import { PersonalityDocument } from "@models/types";
import { getChatCommandsCount } from "@services/chatCommands";
import { getMessageCategoriesCount } from "@services/messageCategories";
import { getTimersCount } from "@services/timers";
import { getTriggersCount } from "@services/triggers";
import { checkExistResource } from "@utils/checkExistResourceUtil";
import { AppError, handleAppError } from "@utils/ErrorHandlerUtil";
import { logger } from "@utils/loggerUtil";
import { FilterQuery, UpdateQuery } from "mongoose";
import {
  ManyPersonalitiesFindOptions,
  PersonalityCreateData,
  PersonalityUpdateData,
} from "./types";

export const getPersonalities = async (
  filter: FilterQuery<PersonalityDocument> = {},
  personalityFindOptions: ManyPersonalitiesFindOptions
) => {
  const {
    limit = 50,
    skip = 1,
    sort = { createdAt: -1 },
    select = { __v: 0 },
  } = personalityFindOptions;

  try {
    const personality = await Personality.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .sort(sort);

    return personality;
  } catch (err) {
    logger.error(`Error occured while getting personalities. ${err}`);
    handleAppError(err);
  }
};

export const getPersonalitiesCount = async (
  filter: FilterQuery<PersonalityDocument> = {}
) => {
  return await Personality.countDocuments(filter);
};

export const createPersonality = async (
  createData: PersonalityCreateData | PersonalityCreateData[]
) => {
  try {
    const createdPersonality = await Personality.create(createData);

    if (!createdPersonality) {
      throw new AppError(400, "Couldn't create new personality(s");
    }
    return createdPersonality;
  } catch (err) {
    logger.error(`Error occured while creating personality(ies). ${err}`);
    handleAppError(err);
  }
};

export const updatePersonalities = async (
  filter: FilterQuery<PersonalityDocument> = {},
  updateData: UpdateQuery<PersonalityUpdateData>
) => {
  try {
    await Personality.updateMany(filter, updateData, {
      new: true,
    });
  } catch (err) {
    logger.error(`Error occured while updating many personalitys. ${err}`);
    handleAppError(err);
  }
};

export const updatePersonalityById = async (
  id: string,
  updateData: UpdateQuery<PersonalityUpdateData>
) => {
  try {
    const updatedPersonality = await Personality.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );

    const personality = checkExistResource(
      updatedPersonality,
      `Personality with id(${id})`
    );

    return personality;
  } catch (err) {
    logger.error(
      `Error occured while editing personality by id(${id}). ${err}`
    );
    handleAppError(err);
  }
};

export const deletePersonalityById = async (id: string) => {
  try {
    const filter = { personality: id };
    const countPersonalitiesInDocs = await Promise.all([
      getTriggersCount(filter),
      getChatCommandsCount(filter),
      getTimersCount(filter),
      getMessageCategoriesCount(filter),
    ]);

    if (countPersonalitiesInDocs.reduce((a, b) => a + b) > 0) {
      throw new AppError(
        409,
        `Personality with id(${id}) is used somewhere else, cannot delete`
      );
    }

    const deletedPersonality = await Personality.findByIdAndDelete(id);

    const personality = checkExistResource(
      deletedPersonality,
      `Personality with id(${id})`
    );

    return personality;
  } catch (err) {
    logger.error(
      `Error occured while deleting personality by id(${id}). ${err}`
    );
    handleAppError(err);
  }
};

export const getPersonalityById = async (
  id: string,
  filter: FilterQuery<PersonalityDocument> = {}
) => {
  try {
    const foundPersonality = await Personality.findById(id, filter);

    const personality = checkExistResource(
      foundPersonality,
      `Personality with id(${id})`
    );

    return personality;
  } catch (err) {
    logger.error(`Error occured while getting personality: ${err}`);
    handleAppError(err);
  }
};

export const getOnePersonality = async (
  filter: FilterQuery<PersonalityDocument> = {}
) => {
  try {
    const foundPersonality = await Personality.findOne(filter);

    const personality = checkExistResource(foundPersonality, "Personality");

    return personality;
  } catch (err) {
    logger.error(`Error occured while getting personality: ${err}`);
    handleAppError(err);
  }
};
