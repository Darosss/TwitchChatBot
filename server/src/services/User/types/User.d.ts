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

export interface UserOptionalData {
  follower?: Date;
  notes?: string[];
  privileges?: number;
  lastSeen?: Date;
  points?: number;
  messageCount?: number;
}

export interface UserCreateData extends UserOptionalData {
  twitchId: string;
  username: string;
  twitchName: string;
}

export interface UserUpdateData
  extends UserOptionalData,
    Partial<Omit<UserCreateData, "twitchId">> {}
