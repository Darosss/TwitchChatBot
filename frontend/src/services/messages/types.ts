import { DefaultRequestParams } from "../api";
import { User } from "../users";

export interface Message {
  _id: string;
  message: string;
  date: Date;
  owner: User;
  ownerUsername: string;
}

export interface FetchMessagesParams
  extends DefaultRequestParams<keyof Message> {
  search_name?: string;
  owner?: string;
  start_date?: string;
  end_date?: string;
}
