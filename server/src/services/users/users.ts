import { UserDocument, User } from "@models";
import { checkExistResource, handleAppError, logger } from "@utils";
import { FilterQuery, UpdateQuery } from "mongoose";
import { ManyUsersFindOptions, UserCreateData, UserFindOptions, UserUpdateData } from "./types";

export const getUsers = async (filter: FilterQuery<UserDocument> = {}, findOptions: ManyUsersFindOptions) => {
  const { limit = 50, skip = 1, sort = {}, select = { __v: 0 }, populate } = findOptions;

  try {
    const users = await User.find(filter)
      .limit(limit * 1)
      .skip((skip - 1) * limit)
      .select(select)
      .sort(sort)
      .populate([...(populate?.displayBadges ? [{ path: "displayBadges" }] : [])]);
    return users;
  } catch (err) {
    logger.error(`Error occured while getting users. ${err}`);
    handleAppError(err);
  }
};

export const getOneUser = async (filter: FilterQuery<UserDocument> = {}, findOptions: UserFindOptions) => {
  const { select = { __v: 0 }, populate } = findOptions;
  try {
    const userFiltered = await User.findOne(filter)
      .select(select)
      .populate([...(populate?.displayBadges ? [{ path: "displayBadges" }] : [])]);

    const user = checkExistResource(userFiltered, "User");

    return user;
  } catch (err) {
    logger.error(`Error occured while getting user. ${err}`);
    handleAppError(err);
  }
};

export const getUserById = async (id: string, findOptions: UserFindOptions) => {
  const { select = { __v: 0 } } = findOptions;
  try {
    const userById = await User.findById(id).select(select);

    const user = checkExistResource(userById, "User");

    return user;
  } catch (err) {
    logger.error(`Error occured while getting user with id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const updateUserById = async (id: string, updateData: UpdateQuery<UserUpdateData>) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true
    });

    const user = checkExistResource(updatedUser, "User");

    return user;
  } catch (err) {
    logger.error(`Error occured while updating user with id(${id}). ${err}`);
    handleAppError(err);
  }
};

export const getUserCount = async (filter: FilterQuery<UserDocument>) => {
  return await User.countDocuments(filter);
};

/**
 * Returns the usernames of given limit and skip and total count of users
 * @param limit {number} max returned usernames
 * @param skip {number} skip docs in db
 * @returns {Promise<{usernames:string[], total:number}>} Promise object with usernames[] and total count of users
 */
export const getUsernames = async (
  limit = 20,
  skip = 0
): Promise<{ usernames: string[]; total: number } | undefined> => {
  try {
    const users = await User.find({}).select("username").limit(limit).skip(skip).exec();

    return {
      usernames: users.map((user) => user.username),
      total: await User.countDocuments()
    };
  } catch (err) {
    logger.error(`Error occured while getting users usernames. ${err}`);
    handleAppError(err);
  }
};

/**
 * Returns the twitchNames of given limit and skip and total count of users
 * @param limit {number} max returned usernames
 * @param skip {number} skip docs in db
 * @returns {Promise<{twitchNames:string[], total:number}>} Promise object with twitchNames[] and total count of users
 */
export const getTwitchNames = async (
  limit = 20,
  skip = 0
): Promise<{ twitchNames: string[]; total: number } | undefined> => {
  try {
    const users = await User.find({}).select("twitchName").limit(limit).skip(skip).exec();

    return {
      twitchNames: users.map((user) => user.twitchName || "undefinedTwitchName"),
      total: await User.countDocuments()
    };
  } catch (err) {
    logger.error(`Error occured while getting users twitch names. ${err}`);
    handleAppError(err);
  }
};

export const isUserInDB = async (filter: FilterQuery<UserDocument>) => {
  const user = await User.findOne(filter);
  if (user) return user;
};

export const createUser = async (createData: UserCreateData) => {
  try {
    const user = await User.create(createData);
    return user;
  } catch (err) {
    logger.error(`Error occured while create user. ${err}`);
    handleAppError(err);
  }
};

export const createUserIfNotExist = async (filter: FilterQuery<UserDocument>, createData: UserCreateData) => {
  try {
    const user = await User.findOneAndUpdate(filter, createData, { upsert: true, new: true });

    return user;
  } catch (err) {
    logger.error(`Error occured while creating user if not exist. ${err}`);
    handleAppError(err);
  }
};

export const updateUser = async (filter: FilterQuery<UserDocument>, updateData: UpdateQuery<UserUpdateData>) => {
  try {
    const updatedUser = await User.findOneAndUpdate(filter, updateData, {
      new: true
    });

    const user = checkExistResource(updatedUser, "User");

    return user;
  } catch (err) {
    logger.error(`Error occured while creating user if not exist. ${err}`);
    handleAppError(err);
  }
};

export const getFollowersCount = async (startDate?: Date, endDate?: Date) => {
  try {
    const followersCount = await getUserCount({
      ...(startDate &&
        endDate && {
          follower: { $gte: startDate, $lt: endDate }
        })
    });
    return followersCount;
  } catch (err) {
    logger.error(`Error occured while getting followers count. ${err}`);
    handleAppError(err);
  }
};
