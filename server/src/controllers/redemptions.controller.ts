import Express, { Request, Response } from "express";
import { Redemption } from "@models/redemption.model";
import { TwitchSession } from "@models/twitch-session.model";
import { User } from "@models/user.model";
import { IRequestParams, IRequestRedemptionQuery } from "@types";
import { filterRedemptionsByUrlParams } from "./filters/redemptions.filter";

const getRedemptions = async (
  req: Request<{}, {}, {}, IRequestRedemptionQuery>,
  res: Response
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterRedemptionsByUrlParams(req.query);
  try {
    const redemptions = await Redemption.find(searchFilter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select({ __v: 0 })
      .sort({ redemptionDate: -1 })
      .exec();

    const count = await Redemption.countDocuments(searchFilter);

    res.status(200).send({
      redemptions,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Couldn't get redemptions" });
  }
};

const getUserRedemptions = async (
  req: Request<IRequestParams, {}, {}, IRequestRedemptionQuery>,
  res: Response
) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterRedemptionsByUrlParams(req.query);

  try {
    const user = await User.findById(id);

    const searchFilterWithUser = Object.assign(
      { userId: user?.twitchId },
      searchFilter
    );

    const redemptions = await Redemption.find(searchFilterWithUser)
      .limit(limit * 1)
      .sort({ date: -1 })
      .skip((page - 1) * limit)

      .select({ __v: 0 })
      .exec();

    const count = await Redemption.countDocuments(searchFilterWithUser);

    res.status(200).send({
      redemptions,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({ message: "Couldn't get user redemptions" });
  }
};

const getSessionRedemptions = async (
  req: Request<IRequestParams, {}, {}, IRequestRedemptionQuery>,
  res: Response
) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query;

  try {
    const session = await TwitchSession.findById(id);

    const searchFilter = Object.assign(
      {
        redemptionDate: {
          $gte: session?.sessionStart,
          $lte: session?.sessionEnd,
        },
      },
      filterRedemptionsByUrlParams(req.query)
    );

    const redemptions = await Redemption.find(searchFilter)
      .limit(limit * 1)
      .sort({ redemptionDate: -1 })
      .skip((page - 1) * limit)
      .select({ __v: 0 })
      .exec();

    const count = await Redemption.countDocuments(searchFilter);

    res.status(200).send({
      redemptions,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({ message: "Couldn't get redemptions from session" });
  }
};

export { getRedemptions, getUserRedemptions, getSessionRedemptions };
