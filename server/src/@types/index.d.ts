import { Request } from "express";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@libs/types";
import { ParamsDictionary, Query } from "express-serve-static-core";
import {
  MessageCategoryModel,
  StreamSessionModel,
  TriggerModel,
} from "@models/types";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HOST_FRONTEND_URL: string;
      LOCAL_FRONTEND_URL: string;
      BACKEND_PORT: string;
      CLIENT_ID: string;
      CLIENT_SECRET: string;
      REDIRECT_URL: string;
      DATABASE_CONNECT_URL: string;
      BOT_USERNAME: string;
      BOT_PASSWORD: string;
      BOT_ID: string;
      NODE_ENV: "development" | "production";
    }
  }
  namespace Express {
    interface Request {
      io: Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
      >;
    }
  }
}

interface RequestParams extends ParamsDictionary {
  id: string;
}

interface RequestQuery<T = unknown> extends Query {
  limit?: number;
  page?: number;
  sortBy?: keyof T;
  sortOrder?: "asc" | "desc";
}

interface RequestSearch<T> extends RequestQuery<T> {
  search_name?: string;
}

interface RequestSearchDate<T> extends RequestSearch<T> {
  start_date?: Date;
  end_date?: Date;
}

interface RequestQueryMessage extends RequestSearchDate<MessageModel> {
  owner?: string;
}

interface RequestQueryMessageCategories
  extends RequestSearchDate<MessageCategoryModel> {
  messages?: string;
}

interface RequestQueryUser extends RequestSearch<UserModel> {
  seen_start?: Date;
  seen_end?: Date;
  privilege?: number;
  created_start?: Date;
  created_end?: Date;
}

interface RequestQueryLatestEldestMsgs extends RequestSearch<MessageModel> {}

interface RequestQuerySession extends RequestSearchDate<StreamSessionModel> {
  tags?: string;
  categories?: string;
}

interface RequestRedemptionQuery extends RequestSearchDate<RedemptionModel> {
  receiver?: string;
  cost?: number;
  message?: string;
}
interface RequestCommandsQuery extends RequestSearchDate<ChatCommandModel> {
  created?: string;
  privilege?: number;
  description?: string;
  aliases?: string;
  messages?: string;
}

interface RequestTriggerQuery extends RequestSearchDate<TriggerModel> {
  words?: string;
  messages?: string;
}

interface RequestTimerQuery
  extends RequestQuery<TimerModel>,
    RequestSearchDate {
  messages?: string;
}

interface AuthorizationTwitch {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
}
