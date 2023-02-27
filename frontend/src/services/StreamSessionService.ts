import useAxiosCustom, { IPagination, ResponseData } from "./Api.service";

export interface IStreamSession {
  _id: string;
  sessionStart: Date;
  sessionEnd: Date;
  sessionTitles: Record<string, string>;
  categories: Record<string, string>;
  tags: Record<string, string>;
  viewers: Map<string, number>;
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

export interface IStreamSessionStatistics {
  messagesCount: number;
  topMsgsUsers: TopMsgsUsers[];
  topRedemptionsUsers: TopRedemptionsUsers[];
  topUsedWords: TopUsedWords[];
  viewers: Map<string, number>;
}

const getSessions = () => {
  return useAxiosCustom<IPagination<IStreamSession>>({
    url: `/stream-sessions`,
  });
};

const getSessionById = (sessionId: string) => {
  return useAxiosCustom<ResponseData<IStreamSession>>({
    url: `/stream-sessions/${sessionId}`,
  });
};

const getSessionStatistics = () => {
  return useAxiosCustom<{ data: IStreamSessionStatistics }>({
    url: `/stream-sessions/current-session/statistics`,
  });
};

export default { getSessions, getSessionStatistics, getSessionById };
