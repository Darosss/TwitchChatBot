import { IUser, IUserDocument } from "@models/types";

type SortQuery = { [P in keyof IUser]?: 1 | -1 };
type SelectQuery = { [P in keyof IUser]?: 1 | 0 };

export interface UserFindOptions {
  select?: SelectQuery | {};
}

export interface ManyUsersFindOptions extends UserFindOptions {
  sort?: SortQuery | {};
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

export interface UserUpdateData extends UserOptionalData {
  username?: string;
  twitchName?: string;
}
