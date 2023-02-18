import useAxiosCustom, { IPagination, ResponseData } from "./Api.service";

export interface ITwitchSession {
  _id: string;
  sessionStart: Date;
  sessionEnd: Date;
  sessionTitles: string[];
  categories: string[];
  tags: string[];
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
export interface ITwitchSessionStatistics {
  messagesCount: number;
  topMsgsUsers: TopMsgsUsers[];
  topRedemptionsUsers: TopRedemptionsUsers[];
  topUsedWords: TopUsedWords[];
}

const getSessions = () => {
  return useAxiosCustom<IPagination<ITwitchSession>>({
    url: `/twitch-sessions`,
  });
};

const getSessionStatistics = () => {
  return useAxiosCustom<{ data: ITwitchSessionStatistics }>({
    url: `/twitch-sessions/current-session/statistics`,
  });
};

export default { getSessions, getSessionStatistics };
