import { ParamsDictionary, Query } from "express-serve-static-core";
import {
  MessageCategoryModel,
  StreamSessionModel,
  TriggerModel,
  MessageModel,
  ChatCommandModel,
  RedemptionModel,
  TimerModel,
  UserModel,
} from "@models/types";

export interface RequestParams extends ParamsDictionary {
  id: string;
}

export interface RequestQuery<T = unknown> extends Query {
  limit?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface RequestSearch<T> extends RequestQuery<T> {
  search_name?: string;
}

export interface RequestSearchDate<T> extends RequestSearch<T> {
  start_date?: string;
  end_date?: string;
}

export interface RequestQueryMessage extends RequestSearchDate<MessageModel> {
  owner?: string;
}

export interface RequestQueryMessageCategories
  extends RequestSearchDate<MessageCategoryModel> {
  messages?: string;
}

export interface RequestQueryUser extends RequestSearch<UserModel> {
  seen_start?: string;
  seen_end?: string;
  privilege?: string;
  created_start?: string;
  created_end?: string;
}

export interface RequestQueryLatestEldestMsgs
  extends RequestSearch<MessageModel> {}

export interface RequestQuerySession
  extends RequestSearchDate<StreamSessionModel> {
  tags?: string;
  categories?: string;
}

export interface RequestRedemptionQuery
  extends RequestSearchDate<RedemptionModel> {
  receiver?: string;
  cost?: string;
  message?: string;
}
export interface RequestCommandsQuery
  extends RequestSearchDate<ChatCommandModel> {
  created?: string;
  privilege?: string;
  description?: string;
  aliases?: string;
  messages?: string;
}

export interface RequestTriggerQuery extends RequestSearchDate<TriggerModel> {
  words?: string;
  messages?: string;
}

export interface RequestTimerQuery extends RequestSearchDate<TimerModel> {
  messages?: string;
}

export interface AuthorizationTwitch {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
}
