import useAxiosCustom, { PaginationData, ResponseData } from "./ApiService";
import { Message } from "./MessageService";
import { Redemption } from "./RedemptionService";
import { User } from "./UserService";

export interface SessionEvents {
  _id: string;
  user: User;
  name: string;
  createdAt: Date;
  updatedAt: Date;
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

export const getSessions = () => {
  return useAxiosCustom<PaginationData<StreamSession>>({
    url: `/stream-sessions`,
  });
};

export const getSessionById = (sessionId: string) => {
  return useAxiosCustom<ResponseData<StreamSession>>({
    url: `/stream-sessions/${sessionId}`,
  });
};

export const getSessionMessages = (sessionId: string) => {
  return useAxiosCustom<PaginationData<Message>>({
    url: `/stream-sessions/${sessionId}/messages`,
  });
};

export const getSessionRedemptions = (sessionId: string) => {
  return useAxiosCustom<PaginationData<Redemption>>({
    url: `/stream-sessions/${sessionId}/redemptions`,
  });
};

export const getCurrentSessionMessages = () => {
  return useAxiosCustom<PaginationData<Message>>({
    url: `/stream-sessions/current-session/messages`,
  });
};

export const getCurrentSessionRedemptions = () => {
  return useAxiosCustom<PaginationData<Redemption>>({
    url: `/stream-sessions/current-session/redemptions`,
  });
};

export const getCurrentSessionStatistics = () => {
  return useAxiosCustom<{ data: StreamSessionStatistics }>({
    url: `/stream-sessions/current-session/statistics`,
  });
};
