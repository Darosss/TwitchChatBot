import { PopulateOption, PopulateOptions } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";
import { ITwitchSession } from "@models/types";

export interface TwitchSessionFindOptions {
  select?: SelectQuery<ITwitchSession> | {};
}

export interface ManyTwitchSessionFindOptions extends TwitchSessionFindOptions {
  sort?: SortQuery<ITwitchSession> | {};
  skip?: number;
  limit?: number;
}

export interface TwitchSessionOptionalData {
  sessionEnd?: Date;
  sessionTitles?: string[];
  categories?: string[];
  tags?: string[];
}

export interface TwitchSessionCreateData extends TwitchSessionOptionalData {
  sessionStart: Date;
}
