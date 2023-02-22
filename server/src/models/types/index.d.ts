import { Document, Types } from "mongoose";

export interface IUser {
  _id: string;
  twitchId: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  privileges: number;
  points?: number;
  lastSeen?: Date;
  messageCount?: number;
  notes?: string[];
  twitchName?: string;
  twitchCreated?: Date;
  follower?: Date;
}

export type IUserDocument = IUser & Document;

export interface IMessage {
  _id: string;
  message: string;
  date: Date;
  owner: string | IUser;
  ownerUsername: string;
}

export type IMessageDocument = IMessage & Document;

export interface IRedemption {
  _id: string;
  rewardId: string;
  userId: string;
  twitchId: string;
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
  _id: string;
  sessionStart: Date;
  sessionEnd: Date;
  sessionTitles: Map<string, string>;
  categories: Map<string, string>;
  tags: Map<string, string>;
  viewers: Map<string, number>;
}

export type ITwitchSessionDocument = ITwitchSession & Document;

export interface ITrigger {
  _id: string;
  name: string;
  enabled: boolean;
  chance: number;
  delay: number;
  onDelay: boolean;
  words: string[];
  messages: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ITriggerDocument = ITrigger & Document;

export interface IConfig {
  _id: string;
  commandsPrefix: string;
  timersIntervalDelay: number;
  activeUserTimeDelay: number;
  chatGamesIntervalDelay: number;
  minActiveUsersThreshold: number;
  intervalCheckChatters: number;
  intervalCheckViewersPeek: number;
  permissionLevels: {
    broadcaster: number;
    mod: number;
    vip: number;
    all: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type IConfigDocument = IConfig & Document;

export interface IChatCommand {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  enabled: boolean;
  aliases: string[];
  messages: string[];
  privilege: number;
  useCount: number;
}

export type IChatCommandDocument = IChatCommand & Document;

export interface IAuth {
  _id: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  obtainmentTimestamp: number;
  scope: string[];
}

export type IAuthDocument = IAuth & Document;
