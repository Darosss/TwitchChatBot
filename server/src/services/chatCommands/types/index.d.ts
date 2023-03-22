import { ChatCommandModel } from "@models/types";
import { SortQuery, SelectQuery } from "@services/types";
import { PopulateOption, PopulateOptions } from "mongoose";

export interface ChatCommandsFindOptions {
  select?: SelectQuery<ChatCommandModel> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyChatCommandsFindOptions extends ChatCommandsFindOptions {
  sort?: SortQuery<ChatCommandModel> | {};
  skip?: number;
  limit?: number;
}

export interface ChatCommandOptionalData
  extends Partial<
    Omit<ChatCommandModel, "_id" | "createdAt" | "updatedAt" | "uses">
  > {}

export interface ChatCommandCreateData
  extends Pick<ChatCommandModel, "name">,
    ChatCommandOptionalData {}

export interface ChatCommandUpdateData
  extends ChatCommandOptionalData,
    Partial<ChatCommandCreateData> {}
