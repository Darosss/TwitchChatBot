import { User } from "../users";

export interface Message {
  _id: string;
  message: string;
  date: Date;
  owner: User;
  ownerUsername: string;
}
