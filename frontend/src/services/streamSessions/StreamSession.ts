import { useQuery } from "react-query";
import {
  BaseEndpointNames,
  QueryParams,
  PromisePaginationData,
  customAxios,
  PromiseBackendData,
  queryKeysParamsHelper,
} from "../api";
import { FetchMessagesParams, Message } from "../messages";
import {
  FetchStreamSessionsParams,
  StreamSession,
  StreamSessionRedemptions,
  StreamSessionStatistics,
} from "./types";
import { FetchRedemptionsParams, Redemption } from "../redemptions";

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
  streamSessionMessages: (
    id: string,
    params?: QueryParams<keyof FetchMessagesParams>
  ) =>
    ["stream-sessions-messages", id, queryKeysParamsHelper(params)] as [
      string,
      string,
      string
    ],
  streamSessionRedemptions: (
    id: string,
    params?: QueryParams<keyof FetchMessagesParams>
  ) =>
    ["stream-sessions-redemptions", id, queryKeysParamsHelper(params)] as [
      string,
      string,
      string
    ],
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
  id: string,
  params?: QueryParams<keyof FetchMessagesParams>
): PromisePaginationData<Message> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/${id}/messages`,
    { params }
  );
  return response.data;
};
export const fetchSessionRedemptions = async (
  id: string,
  params?: QueryParams<keyof FetchRedemptionsParams>
): PromisePaginationData<Redemption> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/${id}/redemptions`,
    { params }
  );
  return response.data;
};

export const fetchCurrentSessionMessages = async (
  params?: QueryParams<keyof FetchMessagesParams>
): PromisePaginationData<Message> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/current-session/messages`,
    { params }
  );
  return response.data;
};

export const fetchCurrentSessionStatistics =
  async (): PromiseBackendData<StreamSessionStatistics | null> => {
    const response = await customAxios.get(
      `/${baseEndpointName}/current-session/statistics`
    );
    return response.data;
  };

export const fetchCurrentSessionRedemptions = async (
  params?: QueryParams<keyof FetchRedemptionsParams>
): PromiseBackendData<StreamSessionRedemptions> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/current-session/redemptions`,
    { params }
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

export const useGetSessionMessages = (
  id: string,
  params?: QueryParams<keyof FetchMessagesParams>
) => {
  return useQuery(
    queryKeysStreamSessions.streamSessionMessages(id, params),
    () => fetchSessionMessages(id, params)
  );
};
export const useGetSessionRedemptions = (
  id: string,
  params?: QueryParams<keyof FetchRedemptionsParams>
) => {
  return useQuery(
    queryKeysStreamSessions.streamSessionRedemptions(id, params),
    () => fetchSessionRedemptions(id, params)
  );
};

export const useGetCurrentSessionMessages = (
  params?: QueryParams<keyof FetchMessagesParams>
) => {
  return useQuery(queryKeysStreamSessions.currentStreamSessionMessages, () =>
    fetchCurrentSessionMessages(params)
  );
};

export const useGetCurrentSessionStatistics = () => {
  return useQuery(
    queryKeysStreamSessions.currentStreamSessionStatistics,
    fetchCurrentSessionStatistics
  );
};

export const useGetCurrentSessionRedemptions = (
  params?: QueryParams<keyof FetchRedemptionsParams>
) => {
  return useQuery(queryKeysStreamSessions.currentStreamSessionRedemptions, () =>
    fetchCurrentSessionRedemptions(params)
  );
};
