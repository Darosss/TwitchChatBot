import Express, { Request, Response } from "express";
import { User } from "../models/user.model";

const getUsers = async (req: Request, res: Response) => {
  const { page = 1, limit = 50 } = req.query as unknown as {
    page: number;
    limit: number;
  };

  try {
    const users = await User.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select({ __v: 0 })
      .exec();

    const count = await User.countDocuments();

    res.status(200).send({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);

    res.status(200).send({ users: "Couldn't get users" });
  }
};

export { getUsers };
