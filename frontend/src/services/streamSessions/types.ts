import {
  BaseModelProperties,
  DefaultRequestParams,
  PaginationData,
} from "../api";
import { Redemption } from "../redemptions";
import { User } from "../users";

export interface SessionEvents extends BaseModelProperties {
  user: User;
  name: string;
}

export interface StreamSession {
  _id: string;
  sessionStart: Date;
  sessionEnd: Date;
  sessionTitles: Record<string, string>;
  categories: Record<string, string>;
  tags: Record<string, string>;
  viewers: Map<string, number>;
  events: SessionEvents[];
}

export interface TopMsgsUsers {
  _id: string;
  messageCount: number;
  username: string;
}

export interface TopRedemptionsUsers {
  _id: string;
  redemptionsCount: number;
  redemptionsCost: number;
  username: string;
}

export interface TopUsedWords {
  _id: number;
  count: number;
}

export interface StreamSessionStatistics {
  messagesCount: number;
  topMsgsUsers: TopMsgsUsers[];
  topRedemptionsUsers: TopRedemptionsUsers[];
  topUsedWords: TopUsedWords[];
  viewers: Map<string, number>;
}
export type StreamSessionRedemptions = PaginationData<Redemption>;

export interface FetchStreamSessionsParams
  extends DefaultRequestParams<keyof StreamSession> {
  search_name?: string;
  tags?: string;
  categories?: string;
  start_date?: string;
  end_date?: string;
}
