import { PopulateOption, PopulateOptions } from "mongoose";

type SortQuery = { [P in keyof IMessage]?: 1 | -1 };
type SelectQuery = { [P in keyof IMessage]?: 1 | 0 };

export interface MessageCreateData {
  message: string;
  date: Date;
  owner: string;
}

export interface MessageFindOptions {
  select?: SelectQuery | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyMessageFindOptions extends MessageFindOptions {
  sort?: SortQuery | {};
  skip?: number;
  limit?: number;
}
