import { IUserDocument } from "@models/types";
import { User } from "@models/user.model";
import { FilterQuery, UpdateQuery } from "mongoose";
import {
  ManyUsersFindOptions,
  UserCreateData,
  UserFindOptions,
  UserUpdateData,
} from "./types/User";

export const getUsers = async (
  filter: FilterQuery<IUserDocument> = {},
  userFindOptions: ManyUsersFindOptions
) => {
  const {
    limit = 50,
    skip = 1,
    sort = {},
    select = { __v: 0 },
  } = userFindOptions;

  const users = await User.find(filter)
    .limit(limit * 1)
    .skip((skip - 1) * limit)
    .select(select)
    .sort(sort);

  return users;
};

export const getOneUser = async (
  filter: FilterQuery<IUserDocument> = {},
  userFindOptions: UserFindOptions
) => {
  const { select = { __v: 0 } } = userFindOptions;

  const user = await User.findOne(filter).select(select);

  return user;
};

export const getUserById = async (
  id: string,
  userFindOptions: UserFindOptions
) => {
  const { select = { __v: 0 } } = userFindOptions;

  const user = await User.findById(id).select(select);

  return user;
};

export const updateUserById = async (
  id: string,
  userUpdateData: UpdateQuery<UserUpdateData>
) => {
  try {
    const user = await User.findByIdAndUpdate(id, userUpdateData, {
      new: true,
    });
    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update user");
  }
};

export const getUserCount = async (filter: FilterQuery<IUserDocument>) => {
  return await User.countDocuments(filter);
};

/**
 * Returns the usernames of given limit and skip and total count of users
 * @param limit {number} max returned usernames
 * @param skip {number} skip docs in db
 * @returns {Promise<{usernames:string[], total:number}>} Promise object with usernames[] and total count of users
 */
export const getUsernames = async (
  limit: number = 20,
  skip: number = 0
): Promise<{ usernames: string[]; total: number }> => {
  try {
    const users = await User.find({})
      .select("username")
      .limit(limit)
      .skip(skip)
      .exec();

    return {
      usernames: users.map((user) => user.username),
      total: await User.countDocuments(),
    };
  } catch (err) {
    throw err;
  }
};

/**
 * Returns the twitchNames of given limit and skip and total count of users
 * @param limit {number} max returned usernames
 * @param skip {number} skip docs in db
 * @returns {Promise<{twitchNames:string[], total:number}>} Promise object with twitchNames[] and total count of users
 */
export const getTwitchNames = async (
  limit: number = 20,
  skip: number = 0
): Promise<{ twitchNames: string[]; total: number }> => {
  try {
    const users = await User.find({})
      .select("twitchName")
      .limit(limit)
      .skip(skip)
      .exec();

    return {
      twitchNames: users.map((user) => user.twitchName!),
      total: await User.countDocuments(),
    };
  } catch (err) {
    throw err;
  }
};

export const isUserInDB = async (userFilter: FilterQuery<IUserDocument>) => {
  const user = await User.findOne(userFilter);
  if (user) return user;
  else return false;
};

export const createUser = async (userData: UserCreateData) => {
  try {
    const user = await User.create(userData);
    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create user");
  }
};

export const createUserIfNotExist = async (
  userFilter: FilterQuery<IUserDocument>,
  userData: UserCreateData
) => {
  let user = await isUserInDB(userFilter);
  if (user) return user;

  user = await createUser(userData);

  return user;
};

export const updateUser = async (
  filter: FilterQuery<IUserDocument>,
  updateData: UpdateQuery<UserUpdateData>
) => {
  try {
    const user = await User.findOneAndUpdate(filter, updateData, {
      new: true,
    });
    return user;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update user");
  }
};
