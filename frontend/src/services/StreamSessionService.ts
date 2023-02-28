import useAxiosCustom, { IPagination, IResponseData } from "./ApiService";

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

const getSessions = () => {
  return useAxiosCustom<IPagination<IStreamSession>>({
    url: `/stream-sessions`,
  });
};

const getSessionById = (sessionId: string) => {
  return useAxiosCustom<IResponseData<IStreamSession>>({
    url: `/stream-sessions/${sessionId}`,
  });
};

const getSessionStatistics = () => {
  return useAxiosCustom<{ data: IStreamSessionStatistics }>({
    url: `/stream-sessions/current-session/statistics`,
  });
};

export default { getSessions, getSessionStatistics, getSessionById };
