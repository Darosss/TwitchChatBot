import { Badge } from "../achievements";
import {
  BaseModelProperties,
  DefaultRequestParams,
  ResponseData,
} from "../api";
import { Message } from "../messages";

export type UserDisplayBadgesType = [Badge, Badge, Badge];

export interface User extends BaseModelProperties {
  twitchId: string;
  username: string;
  privileges: number;
  points: number;
  watchTime: number;
  lastSeen?: Date;
  messageCount: number;
  notes?: string[];
  twitchName?: string;
  twitchCreated?: Date;
  follower?: Date;
  displayBadges?: UserDisplayBadgesType;
}

export interface UserUpdateData
  extends Partial<
    Omit<User, "_id" | "twitchId" | "twitchName" | "twitchCreated">
  > {}

export interface FirstAndLatestMsgs {
  firstMessages: Message[];
  latestMessages: Message[];
}

export interface GetUsersByIdsResponse extends ResponseData<User[]> {
  count: number;
}

export interface FetchUsersParams extends DefaultRequestParams<keyof User> {
  search_name?: string;
  privilege?: number;
  seen_start?: string;
  seen_end?: string;
  created_start?: string;
  created_end?: string;
}
