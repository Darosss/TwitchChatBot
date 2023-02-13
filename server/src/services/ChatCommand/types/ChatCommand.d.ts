import { IChatCommand } from "@models/types";
import { PopulateOption, PopulateOptions } from "mongoose";

type SortQuery = { [P in keyof IChatCommand]?: 1 | -1 };
type SelectQuery = { [P in keyof IChatCommand]?: 1 | 0 };

export interface ChatCommandsFindOptions {
  select?: SelectQuery | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyChatCommandsFindOptions extends ChatCommandsFindOptions {
  sort?: SortQuery | {};
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

export interface ChatCommandUpdateData extends ChatCommandOptionalData {
  name?: string;
}
