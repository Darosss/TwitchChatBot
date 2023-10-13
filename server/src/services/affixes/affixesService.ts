import { Affix } from "@models/affixModel";
import { AffixDocument } from "@models/types";
import { getChatCommandsCount } from "@services/chatCommands";
import { getMessageCategoriesCount } from "@services/messageCategories";
import { getTimersCount } from "@services/timers";
import { getTriggersCount } from "@services/triggers";
import { checkExistResource, AppError, handleAppError, logger } from "@utils";
import { FilterQuery, UpdateQuery } from "mongoose";
import { ManyAffixesFindOptions, AffixCreateData, AffixUpdateData } from "./types";

export const getAffixes = async (filter: FilterQuery<AffixDocument> = {}, affixFindOptions: ManyAffixesFindOptions) => {
  const { limit = 50, skip = 1, sort = { createdAt: -1 }, select = { __v: 0 } } = affixFindOptions;

  try {
    const affix = await Affix.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .sort(sort);

    return affix;
  } catch (err) {
    logger.error(`Error occured while getting affixes. ${err}`);
    handleAppError(err);
  }
};

export const getAffixesCount = async (filter: FilterQuery<AffixDocument> = {}) => {
  return await Affix.countDocuments(filter);
};

export const createAffix = async (createData: AffixCreateData | AffixCreateData[]) => {
  try {
    const createdAffix = await Affix.create(createData);

    if (!createdAffix) {
      throw new AppError(400, "Couldn't create new affix(s");
    }
    return createdAffix;
  } catch (err) {
    logger.error(`Error occured while creating affix(ies). ${err}`);
    handleAppError(err);
  }
};

export const updateAffixes = async (
  filter: FilterQuery<AffixDocument> = {},
  updateData: UpdateQuery<AffixUpdateData>
) => {
  try {
    await Affix.updateMany(filter, updateData, {
      new: true
    });
  } catch (err) {
    logger.error(`Error occured while updating many affixs. ${err}`);
    handleAppError(err);
  }
};

export const updateAffixById = async (id: string, updateData: UpdateQuery<AffixUpdateData>) => {
  try {
    const updatedAffix = await Affix.findByIdAndUpdate(id, updateData, {
      new: true
    });

    const affix = checkExistResource(updatedAffix, `Affix with id(${id})`);

    return affix;
  } catch (err) {
    logger.error(`Error occured while editing affix by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const deleteAffixById = async (id: string) => {
  try {
    const filter = { affix: id };
    const countAffixesInDocs = await Promise.all([
      getTriggersCount(filter),
      getChatCommandsCount(filter),
      getTimersCount(filter),
      getMessageCategoriesCount(filter)
    ]);

    if (countAffixesInDocs.reduce((a, b) => a + b) > 0) {
      throw new AppError(409, `Affix with id(${id}) is used somewhere else, cannot delete`);
    }

    const deletedAffix = await Affix.findByIdAndDelete(id);

    const affix = checkExistResource(deletedAffix, `Affix with id(${id})`);

    return affix;
  } catch (err) {
    logger.error(`Error occured while deleting affix by id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const getAffixById = async (id: string, filter: FilterQuery<AffixDocument> = {}) => {
  try {
    const foundAffix = await Affix.findById(id, filter);

    const affix = checkExistResource(foundAffix, `Affix with id(${id})`);

    return affix;
  } catch (err) {
    logger.error(`Error occured while getting affix: ${err}`);
    handleAppError(err);
  }
};

export const getOneAffix = async (filter: FilterQuery<AffixDocument> = {}) => {
  try {
    const foundAffix = await Affix.findOne(filter);

    const affix = checkExistResource(foundAffix, "Affix");

    return affix;
  } catch (err) {
    logger.error(`Error occured while getting affix: ${err}`);
    handleAppError(err);
  }
};

export const getEnabledSuffixesAndPrefixes = async () => {
  try {
    const suffixesAndPrefixes = await Affix.aggregate<{
      prefixes: string[];
      suffixes: string[];
    }>([
      {
        $match: {
          enabled: true
        }
      },
      {
        $group: {
          _id: null,
          prefixes: { $push: "$prefixes" },
          suffixes: { $push: "$suffixes" }
        }
      }
    ]);

    if (suffixesAndPrefixes.length > 0) {
      return {
        prefixes: [...new Set(suffixesAndPrefixes[0].prefixes.flat())],
        suffixes: [...new Set(suffixesAndPrefixes[0].suffixes.flat())]
      };
    }

    return { prefixes: [""], suffixes: [""] };
  } catch (err) {
    logger.error(`Error occured while aggregating affixes for sufxes and prefixes: ${err}`);
    handleAppError(err);

    return { prefixes: [""], suffixes: [""] };
  }
};

export const getMultiperEnabledAfixesChances = async () => {
  try {
    const averagePercentChances = await Affix.aggregate<{
      prefixesMultipler: number;
      suffixesMultipler: number;
    }>([
      {
        $match: {
          enabled: true
        }
      },
      {
        $group: {
          _id: null,
          prefixesMultipler: { $sum: "$prefixChance" },
          suffixesMultipler: { $sum: "$suffixChance" }
        }
      }
    ]);

    if (averagePercentChances.length > 0) {
      return {
        prefixesMultipler: averagePercentChances[0].prefixesMultipler / 100,
        suffixesMultipler: averagePercentChances[0].suffixesMultipler / 100
      };
    } else {
      return {
        prefixesMultipler: 1,
        suffixesMultipler: 1
      };
    }
  } catch (err) {
    logger.error(`Error occured while aggregating for enabled affixes multipler: ${err}`);
    handleAppError(err);
    return {
      prefixesMultipler: 1,
      suffixesMultipler: 1
    };
  }
};

//Not used, but left for future
export const getAverageEnabledAffixesChances = async () => {
  try {
    const averagePercentChances = await Affix.aggregate<{
      prefixesChances: number;
      suffixesChances: number;
    }>([
      {
        $match: {
          enabled: true
        }
      },
      {
        $group: {
          _id: null,
          prefixesChances: { $avg: "$prefixChance" },
          suffixesChances: { $avg: "$suffixChance" }
        }
      }
    ]);
    if (averagePercentChances.length > 0) {
      return {
        prefixesChances: averagePercentChances[0].prefixesChances,
        suffixesChances: averagePercentChances[0].suffixesChances
      };
    } else {
      return {
        prefixesChances: 0,
        suffixesChances: 0
      };
    }
  } catch (err) {
    logger.error(`Error occured while aggregating for average affixes chances: ${err}`);
    handleAppError(err);
    return {
      prefixesChances: 0,
      suffixesChances: 0
    };
  }
};
