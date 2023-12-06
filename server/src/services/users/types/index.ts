import { UserModel } from "@models";
import { SortQuery, SelectQuery } from "@services";

export interface UserPopulateOptions {
  displayBadges?: boolean;
}
export interface UserFindOptions {
  select?: SelectQuery<UserModel>;
  populate?: UserPopulateOptions;
}

export interface ManyUsersFindOptions extends UserFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type UserCreateData = Partial<Omit<UserModel, "_id" | "createdAt" | "updatedAt">> &
  Pick<UserModel, "twitchId" | "username">;
export type UserUpdateData = Partial<UserCreateData>;
