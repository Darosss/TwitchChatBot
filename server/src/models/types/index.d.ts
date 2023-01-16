import { Date, Document, Types } from "mongoose";

export interface IUser {
  username: string;
  createdAt: Date;
  points: Number;
}

export type IUserDocument = IUser & Document;

export interface IMessage {
  message: String;
  date: Date;
  owner: Types.ObjectId | string;
}

export type IMessageDocument = IMessage & Document;
