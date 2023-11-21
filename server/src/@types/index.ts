import { ParamsDictionary, Query } from "express-serve-static-core";

export interface RequestParams extends ParamsDictionary {
  id: string;
}

export interface RequestQuery extends Query {
  limit?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface RequestSearch extends RequestQuery {
  search_name?: string;
}

export interface RequestSearchDate extends RequestSearch {
  start_date?: string;
  end_date?: string;
}

export interface RequestQueryMessage extends RequestSearchDate {
  owner?: string;
}

export interface RequestQueryMessageCategories extends RequestSearchDate {
  messages?: string;
}

export interface RequestQueryUser extends RequestSearch {
  seen_start?: string;
  seen_end?: string;
  privilege?: string;
  created_start?: string;
  created_end?: string;
}

export type RequestQueryLatestEldestMsgs = RequestSearch;

export interface RequestQuerySession extends RequestSearchDate {
  tags?: string;
  categories?: string;
}

export interface RequestRedemptionQuery extends RequestSearchDate {
  receiver?: string;
  cost?: string;
  message?: string;
}
export interface RequestCommandsQuery extends RequestSearchDate {
  created?: string;
  privilege?: string;
  description?: string;
  aliases?: string;
  messages?: string;
}

export interface RequestTriggerQuery extends RequestSearchDate {
  words?: string;
  messages?: string;
}

export interface RequestTimerQuery extends RequestSearchDate {
  messages?: string;
}

export interface AuthorizationTwitch {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
}

export interface RequestQueryAuthorizationTwitch {
  code: string;
  scope: string;
  state: string;
}

export interface RequestSongsQuery extends RequestSearchDate {
  customId?: string;
}

export interface RequestBadgesQuery extends RequestSearch {
  imagesUrls?: string;
}

export interface RequestAchievementQuery extends RequestSearch {
  custom_action?: string;
}
export interface RequestAchievementStageQuery extends RequestSearch {
  stageName?: string;
  sound?: string;
}
