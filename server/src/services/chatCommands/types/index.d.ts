import { IChatCommand } from "@models/types";
import { SortQuery, SelectQuery } from "@services/types";
import { PopulateOption, PopulateOptions } from "mongoose";

export interface ChatCommandsFindOptions {
  select?: SelectQuery<IChatCommand> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyChatCommandsFindOptions extends ChatCommandsFindOptions {
  sort?: SortQuery<IChatCommand> | {};
  skip?: number;
  limit?: number;
}

export interface ChatCommandOptionalData
  extends Partial<
    Omit<IChatCommand, "_id" | "createdAt" | "updatedAt" | "uses">
  > {}

export interface ChatCommandCreateData
  extends Pick<IChatCommand, "name">,
    ChatCommandOptionalData {}

export interface ChatCommandUpdateData
  extends ChatCommandOptionalData,
    Partial<ChatCommandCreateData> {}
