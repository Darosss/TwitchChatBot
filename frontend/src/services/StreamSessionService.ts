import useAxiosCustom, { IPagination, IResponseData } from "./ApiService";
import { IMessage } from "./MessageService";
import { IRedemption } from "./RedemptionService";

export interface IStreamSession {
  _id: string;
  sessionStart: Date;
  sessionEnd: Date;
  sessionTitles: Record<string, string>;
  categories: Record<string, string>;
  tags: Record<string, string>;
  viewers: Map<string, number>;
}

export interface ITopMsgsUsers {
  _id: string;
  messageCount: number;
  username: string;
}

export interface ITopRedemptionsUsers {
  _id: string;
  redemptionsCount: number;
  redemptionsCost: number;
  username: string;
}

export interface ITopUsedWords {
  _id: number;
  count: number;
}

export interface IStreamSessionStatistics {
  messagesCount: number;
  topMsgsUsers: ITopMsgsUsers[];
  topRedemptionsUsers: ITopRedemptionsUsers[];
  topUsedWords: ITopUsedWords[];
  viewers: Map<string, number>;
}

export const getSessions = () => {
  return useAxiosCustom<IPagination<IStreamSession>>({
    url: `/stream-sessions`,
  });
};

export const getSessionById = (sessionId: string) => {
  return useAxiosCustom<IResponseData<IStreamSession>>({
    url: `/stream-sessions/${sessionId}`,
  });
};

export const getSessionMessages = (sessionId: string) => {
  return useAxiosCustom<IPagination<IMessage>>({
    url: `/stream-sessions/${sessionId}/messages`,
  });
};

export const getSessionRedemptions = (sessionId: string) => {
  return useAxiosCustom<IPagination<IRedemption>>({
    url: `/stream-sessions/${sessionId}/redemptions`,
  });
};

export const getCurrentSessionMessages = () => {
  return useAxiosCustom<IPagination<IMessage>>({
    url: `/stream-sessions/current-session/messages`,
  });
};

export const getCurrentSessionRedemptions = () => {
  return useAxiosCustom<IPagination<IRedemption>>({
    url: `/stream-sessions/current-session/redemptions`,
  });
};

export const getCurrentSessionStatistics = () => {
  return useAxiosCustom<{ data: IStreamSessionStatistics }>({
    url: `/stream-sessions/current-session/statistics`,
  });
};
