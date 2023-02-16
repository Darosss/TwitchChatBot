import { PopulateOption, PopulateOptions } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";

export interface MessageCreateData {
  message: string;
  date: Date;
  owner: string;
}

export interface MessageFindOptions {
  select?: SelectQuery<IMessage> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyMessageFindOptions extends MessageFindOptions {
  sort?: SortQuery<IMessage> | {};
  skip?: number;
  limit?: number;
}
