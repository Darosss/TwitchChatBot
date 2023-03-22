import { UserModel, UserDocument } from "@models/types";
import { SortQuery, SelectQuery } from "@services/types";
export interface UserFindOptions {
  select?: SelectQuery<UserModel> | {};
}

export interface ManyUsersFindOptions extends UserFindOptions {
  sort?: SortQuery<UserModel> | {};
  skip?: number;
  limit?: number;
}

export interface UserCreateData
  extends Omit<UserModel, "_id" | "createdAt" | "updatedAt"> {}

export interface UserUpdateData extends Partial<UserCreateData> {}
