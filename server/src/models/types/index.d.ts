import { Document, Types } from "mongoose";

export interface IUser {
  _id: string | ObjectId;
  username: string;
  createdAt: Date;
  privileges: number;
  points: number;
  lastSeen: Date;
  messageCount: number;
  notes?: string[];
  twitchId?: string;
  twitchName?: string;
  twitchCreated?: Date;
  userDisplayName?: string;
  follower?: Date;
}

export type IUserDocument = IUser & Document;

export interface IMessage {
  _id: string | ObjectId;
  message: string;
  date: Date;
  owner: Types.ObjectId | string | IUser;
}

export type IMessageDocument = IMessage & Document;

export interface IRedemption {
  _id: string | ObjectId;
  rewardId: string;
  userId: string;
  userName: string;
  userDisplayName: string;
  redemptionDate: Date;
  rewardTitle: string;
  rewardCost: number;
  rewardImage: string;
  message?: string;
}

export type IRedemptionDocument = IRedeption & Document;
export interface ITwitchSession {
  _id: string | ObjectId;
  sessionStart: Date;
  sessionEnd: Date;
  sessionTitles: string[];
  categories: string[];
  tags: string[];
}

export type ITwitchSessionDocument = ITwitchSession & Document;
export interface ITrigger {
  _id: string | ObjectId;
  name: string;
  enabled: boolean;
  chance: number;
  delay: number;
  onDelay: boolean;
  words: string[];
  messages: string[];
}

export type ITriggerDocument = ITrigger & Document;

export interface IConfig {
  _id: string | ObjectId;
  commandsPrefix: string;
  timersIntervalDelay: number;
  activeUserTimeDelay: number;
  chatGamesIntervalDelay: number;
  minActiveUsersThreshold: number;
  permissionLevels: {
    broadcaster: number;
    mod: number;
    vip: number;
    all: number;
  };
}

export type IConfigDocument = IConfig & Document;

export interface IChatCommand {
  _id: string | ObjectId;
  name: string;
  createdAt: Date;
  description?: string;
  enabled: boolean;
  aliases: string[];
  messages: string[];
  privilage: number;
  useCount: number;
}

export type IChatCommandDocument = IChatCommand & Document;

export interface IAuth {
  _id: string | ObjectId;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  obtainmentTimestamp: number;
}

export type IAuthDocument = IAuth & Document;
