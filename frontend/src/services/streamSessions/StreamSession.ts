import useAxiosCustom, { PaginationData, ResponseData } from "../api";
import { Message } from "../messages";
import { Redemption } from "../redemptions";
import { StreamSession, StreamSessionStatistics } from "./types";

export const useGetSessions = () => {
  return useAxiosCustom<PaginationData<StreamSession>>({
    url: `/stream-sessions`,
  });
};

export const useGetSessionById = (sessionId: string) => {
  return useAxiosCustom<ResponseData<StreamSession>>({
    url: `/stream-sessions/${sessionId}`,
  });
};

export const useGetSessionMessages = (sessionId: string) => {
  return useAxiosCustom<PaginationData<Message>>({
    url: `/stream-sessions/${sessionId}/messages`,
  });
};

export const useGetSessionRedemptions = (sessionId: string) => {
  return useAxiosCustom<PaginationData<Redemption>>({
    url: `/stream-sessions/${sessionId}/redemptions`,
  });
};

export const useGetCurrentSessionMessages = () => {
  return useAxiosCustom<PaginationData<Message>>({
    url: `/stream-sessions/current-session/messages`,
  });
};

export const useGetCurrentSessionRedemptions = () => {
  return useAxiosCustom<PaginationData<Redemption>>({
    url: `/stream-sessions/current-session/redemptions`,
  });
};

export const useGetCurrentSessionStatistics = () => {
  return useAxiosCustom<{ data: StreamSessionStatistics }>({
    url: `/stream-sessions/current-session/statistics`,
  });
};
