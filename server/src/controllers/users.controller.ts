import Express, { NextFunction, Request, Response } from "express";
import { IRequestQueryUser } from "@types";
import { filterUsersByUrlParams } from "./filters/users.filter";
import {
  getUserById,
  getUserCount,
  getUsers,
  updateUserById,
} from "@services/User";

const getUsersList = async (
  req: Request<{}, {}, {}, IRequestQueryUser>,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 50 } = req.query;
  const searchFilter = filterUsersByUrlParams(req.query);

  try {
    const users = await getUsers(searchFilter, {
      limit: limit,
      skip: page,
      sort: { createdAt: 1 },
    });

    const count = await getUserCount(searchFilter);

    return res.status(200).send({
      data: users,
      totalPages: Math.ceil(count / limit),
      count: count,
      currentPage: Number(page),
    });
  } catch (err) {
    next(err);
  }
};

const getUsersProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id, { select: { __v: 0 } });

    return res.status(200).send({ data: user });
  } catch (err) {
    next(err);
  }
};

const editUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { notes } = req.body;

  try {
    await updateUserById(id, { notes: notes });
    return res.status(200).send({ message: "Updated successfully" });
  } catch (err) {
    next(err);
  }
};
export { getUsersList, getUsersProfile, editUserProfile };
