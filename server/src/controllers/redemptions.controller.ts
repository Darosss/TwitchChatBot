import Express, { Request, Response } from "express";
import { Redemption } from "../models/redemption.model";
import { TwitchSession } from "../models/twitch-session.model";
import { User } from "../models/user.model";

const getRedemptions = async (req: Request, res: Response) => {
  const { page = 1, limit = 50 } = req.query as unknown as {
    page: number;
    limit: number;
  };

  try {
    const redemptions = await Redemption.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select({ __v: 0 })
      .sort({ sessionStart: -1 })
      .exec();

    const count = await Redemption.countDocuments();

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

const getUserRedemptions = async (req: Request, res: Response) => {
  const { page = 1, limit = 50 } = req.query as unknown as {
    page: number;
    limit: number;
  };
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    const redemptions = await Redemption.find({ userId: user?.twitchId })
      .limit(limit * 1)
      .sort({ date: -1 })
      .skip((page - 1) * limit)

      .select({ __v: 0 })
      .exec();

    const count = await Redemption.find({
      userId: user?.twitchId,
    }).countDocuments();

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

const getSessionRedemptions = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = 1, limit = 50 } = req.query as unknown as {
    page: number;
    limit: number;
  };
  try {
    const session = await TwitchSession.findById(id);

    const redemptions = await Redemption.find({
      redemptionDate: {
        $gte: session?.sessionStart,
        $lte: session?.sessionEnd,
      },
    })
      .limit(limit * 1)
      .sort({ redemptionDate: -1 })
      .skip((page - 1) * limit)
      .select({ __v: 0 })
      .exec();

    const count = await Redemption.find().countDocuments();

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
