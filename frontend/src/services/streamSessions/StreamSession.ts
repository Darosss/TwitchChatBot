import { useQuery } from "react-query";
import {
  BaseEndpointNames,
  QueryParams,
  PromisePaginationData,
  customAxios,
  PromiseBackendData,
} from "../api";
import { Message } from "../messages";
import {
  FetchStreamSessionsParams,
  StreamSession,
  StreamSessionRedemptions,
  StreamSessionStatistics,
} from "./types";
import { Redemption } from "../redemptions";

export const fetchStreamSessionsDefaultParams: Required<FetchStreamSessionsParams> =
  {
    limit: 10,
    page: 1,
    search_name: "",
    sortOrder: "asc",
    sortBy: "sessionStart",
    start_date: "",
    end_date: "",
    tags: "",
    categories: "",
  };

const baseEndpointName = BaseEndpointNames.STREAM_SESSIONS;

export const queryKeysStreamSessions = {
  allStreamSessions: "stream-sessions",
  streamSessionById: (id: string) => ["stream-session", id] as [string, string],
  streamSessionMessages: (id: string) =>
    ["stream-sessions-messages", id] as [string, string],
  streamSessionRedemptions: (id: string) =>
    ["stream-sessions-redemptions", id] as [string, string],
  currentStreamSessionMessages: "current-stream-session-messages",
  currentStreamSessionStatistics: "current-stream-session-statistics",
  currentStreamSessionRedemptions: "current-stream-session-redemptions",
};

export const fetchStreamSessions = async (
  params?: QueryParams<keyof FetchStreamSessionsParams>
): PromisePaginationData<StreamSession> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const fetchSessionById = async (
  id: string
): PromiseBackendData<StreamSession> => {
  const response = await customAxios.get(`/${baseEndpointName}/${id}`);
  return response.data;
};

export const fetchSessionMessages = async (
  id: string
): PromisePaginationData<Message> => {
  const response = await customAxios.get(`/${baseEndpointName}/${id}/messages`);
  return response.data;
};
export const fetchSessionRedemptions = async (
  id: string
): PromisePaginationData<Redemption> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/${id}/redemptions`
  );
  return response.data;
};

export const fetchCurrentSessionMessages =
  async (): PromisePaginationData<Message> => {
    const response = await customAxios.get(
      `/${baseEndpointName}/current-session/messages`
    );
    return response.data;
  };

export const fetchCurrentSessionStatistics =
  async (): PromiseBackendData<StreamSessionStatistics> => {
    const response = await customAxios.get(
      `/${baseEndpointName}/current-session/statistics`
    );
    return response.data;
  };

export const fetchCurrentSessionRedemptions =
  async (): PromiseBackendData<StreamSessionRedemptions> => {
    const response = await customAxios.get(
      `/${baseEndpointName}/current-session/redemptions`
    );
    return response.data;
  };

export const useGetSessions = (
  params?: QueryParams<keyof FetchStreamSessionsParams>
) => {
  return useQuery([queryKeysStreamSessions.allStreamSessions, params], () =>
    fetchStreamSessions(params)
  );
};

export const useGetSessionById = (id: string) => {
  return useQuery(queryKeysStreamSessions.streamSessionById(id), () =>
    fetchSessionById(id)
  );
};

export const useGetSessionMessages = (id: string) => {
  return useQuery(queryKeysStreamSessions.streamSessionMessages(id), () =>
    fetchSessionMessages(id)
  );
};
export const useGetSessionRedemptions = (id: string) => {
  return useQuery(queryKeysStreamSessions.streamSessionRedemptions(id), () =>
    fetchSessionRedemptions(id)
  );
};

export const useGetCurrentSessionMessages = () => {
  return useQuery(
    queryKeysStreamSessions.currentStreamSessionMessages,
    fetchCurrentSessionMessages
  );
};

export const useGetCurrentSessionStatistics = () => {
  return useQuery(
    queryKeysStreamSessions.currentStreamSessionStatistics,
    fetchCurrentSessionStatistics
  );
};

export const useGetCurrentSessionRedemptions = () => {
  return useQuery(
    queryKeysStreamSessions.currentStreamSessionRedemptions,
    fetchCurrentSessionRedemptions
  );
};
