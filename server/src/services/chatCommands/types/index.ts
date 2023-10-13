import { ChatCommandModel } from "@models/types";
import { SortQuery, SelectQuery } from "@services";
import { PopulateOption } from "mongoose";

export interface ChatCommandsFindOptions {
  select?: SelectQuery<ChatCommandModel>;
  populateSelect?: PopulateOption.select;
}

export interface ManyChatCommandsFindOptions extends ChatCommandsFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type ChatCommandOptionalData = Partial<Omit<ChatCommandModel, "_id" | "createdAt" | "updatedAt" | "uses">>;

export interface ChatCommandCreateData extends Pick<ChatCommandModel, "name">, ChatCommandOptionalData {}

export interface ChatCommandUpdateData extends ChatCommandOptionalData, Partial<ChatCommandCreateData> {}
