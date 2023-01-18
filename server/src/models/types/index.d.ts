import { Date, Document, Types } from "mongoose";

export interface IUser {
  _id: string | ObjectId;
  username: string;
  createdAt: Date;
  points: Number;
  lastSeen: Date;
  messageCount: Number;
}

export type IUserDocument = IUser & Document;

export interface IMessage {
  _id: string | ObjectId;
  message: String;
  date: Date;
  owner: Types.ObjectId | string | IUser;
}

export type IMessageDocument = IMessage & Document;
