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

export const getMostActiveUsersByRedemptions = async (
  limit: number = 3,
  startDate: Date,
  endDate?: Date
) => {
  const redemptionsFilter = dateRangeRedemptionFilter(startDate, endDate, 5);
  const activeUsers = await Redemption.aggregate([
    {
      $match: redemptionsFilter,
    },
    {
      $group: {
        _id: "$userId",
        redemptionsCount: { $sum: 1 },
        redemptionsCost: { $sum: "$rewardCost" },
      },
    },
    { $sort: { redemptionsCost: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        username: "$user.username",
        redemptionsCount: 1,
        redemptionsCost: 1,
      },
    },
  ]);

  return activeUsers;
};

const dateRangeRedemptionFilter = (
  startDate: Date,
  endDate?: Date,
  additionalHours = 3
) => {
  if (endDate)
    return {
      redemptionDate: { $gte: startDate, $lt: endDate },
    };

  const customEndDate = new Date(startDate).setHours(
    startDate.getHours() + additionalHours
  );
  return {
    redemptionDate: {
      $gte: startDate,
      $lt: new Date(customEndDate),
    },
  };
};
