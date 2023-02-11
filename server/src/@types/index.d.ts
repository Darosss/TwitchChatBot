import { Request } from "express";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "@libs/types";

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

interface IRequestParams {
  id?: string;
}

interface IRequestQuery {
  limit?: number;
  page?: number;
}

interface IRequestSearch extends IRequestQuery {
  search_name?: string;
}

interface IRequestSearchDate {
  start_date?: Date;
  end_date?: Date;
}

interface IRequestQueryMessage extends IRequestSearch, IRequestSearchDate {
  owner?: string;
}

interface IRequestQueryUser extends IRequestSearch {
  seen_start?: Date;
  seen_end?: Date;
  privilege?: number;
  created_start?: Date;
  created_end?: Date;
}
interface IRequestQuerySession extends IRequestSearch, IRequestSearchDate {
  tags?: string;
  categories?: string;
}

interface IRequestRedemptionQuery extends IRequestSearch, IRequestSearchDate {
  receiver?: string;
  cost?: number;
  message?: string;
}
interface IRequestCommandsQuery extends IRequestSearch, IRequestSearchDate {
  created?: string;
  privilege?: number;
  description?: string;
  aliases?: string;
  messages?: string;
}

interface IRequestTriggerQuery extends IRequestSearch, IRequestSearchDate {
  words?: string;
  messages?: string;
}

interface IAuthorizationTwitch {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string[];
  token_type: string;
}
