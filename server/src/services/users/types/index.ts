import { UserModel } from "@models/types";
import { SortQuery, SelectQuery } from "@services";
export interface UserFindOptions {
  select?: SelectQuery<UserModel>;
}

export interface ManyUsersFindOptions extends UserFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type UserCreateData = Omit<UserModel, "_id" | "createdAt" | "updatedAt">;

export type UserUpdateData = Partial<UserCreateData>;
