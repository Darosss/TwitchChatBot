import { Document } from "mongoose";
import { UserModel } from "../users";

export interface MessageModel {
  _id: string;
  message: string;
  date: Date;
  owner: string | UserModel;
  ownerUsername: string;
}

export type MessageDocument = MessageModel & Document;
