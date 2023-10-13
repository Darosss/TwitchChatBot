import { ChatCommandModel } from "@models";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";

export interface ChatCommandsFindOptions {
  select?: SelectQuery<ChatCommandModel>;
  populate?: PopulateSelect;
}

export interface ManyChatCommandsFindOptions extends ChatCommandsFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type ChatCommandOptionalData = Partial<Omit<ChatCommandModel, "_id" | "createdAt" | "updatedAt" | "uses">>;

export interface ChatCommandCreateData extends Pick<ChatCommandModel, "name">, Omit<ChatCommandOptionalData, "name"> {}

export interface ChatCommandUpdateData extends ChatCommandOptionalData, Partial<ChatCommandCreateData> {}
