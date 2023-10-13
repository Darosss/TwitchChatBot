import { SortQuery, SelectQuery, PopulateSelect } from "@services";
import { MessageModel } from "@models";

export type MessageCreateData = Omit<MessageModel, "_id">;

export interface MessageFindOptions {
  select?: SelectQuery<MessageModel>;
  populate?: PopulateSelect;
}

export interface ManyMessageFindOptions extends MessageFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}
