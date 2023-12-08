import { BaseModelProperties } from "../api";
import { Message } from "../messages";

export interface User extends BaseModelProperties {
  twitchId: string;
  username: string;
  privileges: number;
  points: number;
  watchTime: number;
  lastSeen: Date;
  messageCount: number;
  notes?: string[];
  twitchName?: string;
  twitchCreated?: Date;
  follower?: Date;
}

export interface UserUpdateData
  extends Partial<
    Omit<User, "_id" | "twitchId" | "twitchName" | "twitchCreated">
  > {}

export interface FirstAndLatestMsgs {
  firstMessages: Message[];
  latestMessages: Message[];
}

export interface GetUsersByIds {
  data: User[];
  count: number;
}
