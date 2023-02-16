import { Redemption } from "@models/redemption.model";
import { IRedemptionDocument } from "@models/types";
import { FilterQuery } from "mongoose";
import {
  ManyRedemptionsFindOptions,
  RedemptionCreateData,
} from "./types/Redemption";

export const getRedemptions = async (
  filter: FilterQuery<IRedemptionDocument> = {},
  redemptionsFindOptions: ManyRedemptionsFindOptions
) => {
  const {
    limit = 50,
    skip = 1,
    sort = {},
    select = { __v: 0 },
  } = redemptionsFindOptions;

  const redemptions = await Redemption.find(filter)
    .limit(limit * 1)
    .skip((skip - 1) * limit)
    .select(select)
    .sort(sort);

  return redemptions;
};

export const getRedemptionsCount = async (
  filter: FilterQuery<IRedemptionDocument> = {}
) => {
  return await Redemption.countDocuments(filter);
};

export const createRedemption = async (
  redemptionData: RedemptionCreateData
) => {
  try {
    const redemption = await Redemption.create(redemptionData);
    return redemption;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create redemption");
  }
};
