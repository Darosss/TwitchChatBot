import { Request } from "express";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@libs/types";
import { ParamsDictionary, Query } from "express-serve-static-core";

declare global {
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

interface RequestQuery extends Query {
  limit?: number;
  page?: number;
}

interface RequestSearch extends RequestQuery {
  search_name?: string;
}

interface RequestSearchDate {
  start_date?: Date;
  end_date?: Date;
}

interface RequestQueryMessage extends RequestSearch, RequestSearchDate {
  owner?: string;
}

interface RequestQueryMessageCategories extends RequestQuery {
  category?: string;
  messages?: string;
}

interface RequestQueryUser extends RequestSearch {
  seen_start?: Date;
  seen_end?: Date;
  privilege?: number;
  created_start?: Date;
  created_end?: Date;
}
interface RequestQuerySession extends RequestSearch, RequestSearchDate {
  tags?: string;
  categories?: string;
}

interface RequestRedemptionQuery extends RequestSearch, RequestSearchDate {
  receiver?: string;
  cost?: number;
  message?: string;
}
interface RequestCommandsQuery extends RequestSearch, RequestSearchDate {
  created?: string;
  privilege?: number;
  description?: string;
  aliases?: string;
  messages?: string;
}

interface RequestTriggerQuery extends RequestSearch, RequestSearchDate {
  words?: string;
  messages?: string;
}

interface RequestTimerQuery extends RequestSearch, RequestSearchDate {
  messages?: string;
}

interface AuthorizationTwitch {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
}
