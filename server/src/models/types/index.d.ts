import { Document, Types } from "mongoose";

export interface IUser {
  _id: string | ObjectId;
  username: string;
  createdAt: Date;
  points: number;
  lastSeen: Date;
  messageCount: number;
  notes?: string[];
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
  message: string;
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
