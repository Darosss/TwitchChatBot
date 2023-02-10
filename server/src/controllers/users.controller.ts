import Express, { Request, Response } from "express";
import { User } from "@models/user.model";
import { IRequestQueryUser } from "@types";
import { filterUsersByUrlParams } from "./filters/users.filter";

const getUsers = async (
  req: Request<{}, {}, {}, IRequestQueryUser>,
  res: Response
) => {
  const { page = 1, limit = 50 } = req.query;

  const searchFilter = filterUsersByUrlParams(req.query);

  try {
    const users = await User.find(searchFilter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select({ __v: 0 })
      .sort({ lastSeen: -1 })
      .exec();

    const count = await User.countDocuments(searchFilter);

    res.status(200).send({
      users,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({ users: "Couldn't get users" });
  }
};

const getUsersProfile = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select({ __v: 0 });

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Couldn't get user profile" });
  }
};

const editUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;

  try {
    await User.findByIdAndUpdate(id, { notes: notes });
    res.status(200).send({ message: "Updated successfully" });
  } catch (error) {
    res.status(400).send({ message: "Couldn't update note" });
  }
};
export { getUsers, getUsersProfile, editUserProfile };
