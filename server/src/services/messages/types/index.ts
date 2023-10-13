import { PopulateOption } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";
import { MessageModel } from "@models/types";

export type MessageCreateData = Omit<MessageModel, "_id">;

export interface MessageFindOptions {
  select?: SelectQuery<MessageModel>;
  populateSelect?: PopulateOption.select;
}

export interface ManyMessageFindOptions extends MessageFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}
