import { BaseModelProperties } from "../api";
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
