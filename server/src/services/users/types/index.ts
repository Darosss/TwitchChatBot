import { UserModel } from "@models";
import { SortQuery, SelectQuery } from "@services";
export interface UserFindOptions {
  select?: SelectQuery<UserModel>;
}

export interface ManyUsersFindOptions extends UserFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type UserCreateData = Omit<UserModel, "_id" | "createdAt" | "updatedAt" | "badges">;

export type UserUpdateData = Partial<UserCreateData>;
