import Express, { Request, Response } from "express";
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
  res: Response
) => {
  const { page = 1, limit = 50 } = req.query;
  console.log(req.query, "test");
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
  } catch (error) {
    console.error(error);

    return res.status(500).send({ message: "Internal server error" });
  }
};

const getUsersProfile = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id, { select: { __v: 0 } });

    if (!user) return res.status(404).send({ message: "Not found user" });

    return res.status(200).send({ data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const editUserProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;

  try {
    await updateUserById(id, { notes: notes });
    return res.status(200).send({ message: "Updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
export { getUsersList, getUsersProfile, editUserProfile };
