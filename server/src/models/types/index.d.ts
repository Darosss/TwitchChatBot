import { Document, Types } from "mongoose";

export interface UserModel {
  _id: string;
  twitchId: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  privileges: number;
  points?: number;
  watchTime?: number;
  lastSeen?: Date;
  messageCount?: number;
  notes?: string[];
  twitchName?: string;
  twitchCreated?: Date;
  follower?: Date;
}

export type UserDocument = UserModel & Document;

export interface MessageModel {
  _id: string;
  message: string;
  date: Date;
  owner: string | UserModel;
  ownerUsername: string;
}

export type MessageDocument = MessageModel & Document;

export interface RedemptionModel {
  _id: string;
  rewardId: string;
  userId: string | UserModel;
  twitchId: string;
  userName: string;
  userDisplayName: string;
  redemptionDate: Date;
  rewardTitle: string;
  rewardCost: number;
  rewardImage: string;
  message?: string;
}

export type RedemptionDocument = RedemptionModel & Document;

export interface StreamSessionModel {
  _id: string;
  sessionStart: Date;
  sessionEnd: Date;
  sessionTitles: Map<string, string>;
  categories: Map<string, string>;
  tags: Map<string, string>;
  viewers: Map<string, number>;
  watchers: Map<string, number>;
}

export type StreamSessionDocument = StreamSessionModel & Document;

export type TriggerMode = "WHOLE-WORD" | "STARTS-WITH" | "ALL";

export interface TriggerModel {
  _id: string;
  name: string;
  enabled: boolean;
  chance: number;
  delay: number;
  onDelay: boolean;
  uses: number;
  words: string[];
  messages: string[];
  createdAt: Date;
  updatedAt: Date;
  mode: TriggerMode;
}

export type TriggerDocument = TriggerModel & Document;

export interface ConfigModel {
  _id: string;
  commandsPrefix: string;
  timersIntervalDelay: number;
  activeUserTimeDelay: number;
  chatGamesIntervalDelay: number;
  minActiveUsersThreshold: number;
  intervalCheckChatters: number;
  randomMessageChance: number;
  pointsIncrement: {
    message: number;
    watch: number;
    watchMultipler: number;
  };
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

export type ConfigDocument = ConfigModel & Document;

export interface ChatCommandModel {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  enabled: boolean;
  aliases: string[];
  messages: string[];
  privilege: number;
  uses: number;
}

export type ChatCommandDocument = ChatCommandModel & Document;

export interface AuthModel {
  _id: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  obtainmentTimestamp: number;
  scope: string[];
}

export type AuthDocument = AuthModel & Document;

export interface MessageCategoryModel {
  _id: string;
  category: string;
  messages: string[];
  uses: number;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageCategoryDocument = MessageCategoryModel & Document;

interface LayoutBreakpoint {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  static: boolean;
}
export interface WidgetsModel {
  _id: string;
  name: string;
  layout: { [P: string]: LayoutBreakpoint[] };
  toolbox: { [P: string]: LayoutBreakpoint[] };
  createdAt: Date;
  updatedAt: Date;
}

export type WidgetsDocument = WidgetsModel & Document;

export interface OverlayModel {
  _id: string;
  name: string;
  layout: Array;
  createdAt: Date;
  updatedAt: Date;
}

export type OverlayDocument = OverlayModel & Document;
