import { Redemption } from "@models/redemptionModel";
import { RedemptionDocument } from "@models/types";
import { AppError, handleAppError, logger } from "@utils";
import { FilterQuery } from "mongoose";
import { ManyRedemptionsFindOptions, RedemptionCreateData } from "./types";

export const getRedemptions = async (
  filter: FilterQuery<RedemptionDocument> = {},
  redemptionsFindOptions: ManyRedemptionsFindOptions
) => {
  const { limit = 50, skip = 1, sort = {}, select = { __v: 0 } } = redemptionsFindOptions;
  try {
    const redemptions = await Redemption.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .sort(sort);

    return redemptions;
  } catch (err) {
    logger.error(`Error occured while getting redemptions: ${err}`);
    handleAppError(err);
  }
};

export const getRedemptionsCount = async (filter: FilterQuery<RedemptionDocument> = {}) => {
  return await Redemption.countDocuments(filter);
};

export const createRedemption = async (redemptionData: RedemptionCreateData) => {
  try {
    const redemption = await Redemption.create(redemptionData);

    if (!redemption) {
      throw new AppError(400, "Couldn't create new redemption");
    }

    return redemption;
  } catch (err) {
    logger.error(`Error occured while creating redemption: ${err}`);
    handleAppError(err);
  }
};

export const getMostActiveUsersByRedemptions = async (limit = 3, startDate: Date, endDate?: Date) => {
  const redemptionsFilter = dateRangeRedemptionFilter(startDate, endDate, 5);
  try {
    const activeUsers = await Redemption.aggregate([
      {
        $match: redemptionsFilter
      },
      {
        $group: {
          _id: "$userId",
          redemptionsCount: { $sum: 1 },
          redemptionsCost: { $sum: "$rewardCost" }
        }
      },
      { $sort: { redemptionsCost: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          username: "$user.username",
          redemptionsCount: 1,
          redemptionsCost: 1
        }
      }
    ]);

    return activeUsers;
  } catch (err) {
    logger.error(`Error occured while aggregating redemptions for active users : ${err}`);
    handleAppError(err);
  }
};

const dateRangeRedemptionFilter = (startDate: Date, endDate?: Date, additionalHours = 3) => {
  if (endDate)
    return {
      redemptionDate: { $gte: startDate, $lt: endDate }
    };

  const customEndDate = new Date(startDate).setHours(startDate.getHours() + additionalHours);
  return {
    redemptionDate: {
      $gte: startDate,
      $lt: new Date(customEndDate)
    }
  };
};
