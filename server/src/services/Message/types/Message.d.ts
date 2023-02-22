import { PopulateOption, PopulateOptions } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";

export type MessageCreateData = Omit<IMessage, "_id">;

export interface MessageFindOptions {
  select?: SelectQuery<IMessage> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyMessageFindOptions extends MessageFindOptions {
  sort?: SortQuery<IMessage> | {};
  skip?: number;
  limit?: number;
}
