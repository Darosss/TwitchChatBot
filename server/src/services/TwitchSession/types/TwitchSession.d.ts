import { PopulateOption, PopulateOptions } from "mongoose";

export interface TwitchSessionFindOptions {
  select?: SelectQuery | {};
}

export interface ManyTwitchSessionFindOptions extends TwitchSessionFindOptions {
  sort?: SortQuery | {};
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
