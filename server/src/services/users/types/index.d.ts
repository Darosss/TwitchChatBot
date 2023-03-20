import { IUser, IUserDocument } from "@models/types";
import { SortQuery, SelectQuery } from "@services/types";
export interface UserFindOptions {
  select?: SelectQuery<IUser> | {};
}

export interface ManyUsersFindOptions extends UserFindOptions {
  sort?: SortQuery<IUser> | {};
  skip?: number;
  limit?: number;
}

export interface UserCreateData
  extends Omit<IUser, "_id" | "createdAt" | "updatedAt"> {}

export interface UserUpdateData extends Partial<UserCreateData> {}
