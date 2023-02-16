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

export interface ChatCommandOptionalData {
  description?: string;
  enabled?: boolean;
  aliases?: string[];
  messages?: string[];
  privilege?: number;
}

export interface ChatCommandCreateData extends ChatCommandOptionalData {
  name: string;
}

export interface ChatCommandUpdateData
  extends ChatCommandOptionalData,
    Partial<ChatCommandCreateData> {}
