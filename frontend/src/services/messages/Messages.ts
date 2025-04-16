import { useQuery } from "react-query";
import {
  BaseEndpointNames,
  QueryParams,
  PromisePaginationData,
  customAxios,
} from "../api";
import { FetchMessagesParams, Message } from "./types";

export const fetchMessagesDefaultParams: Required<FetchMessagesParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "desc",
  sortBy: "date",
  owner: "",
  start_date: "",
  end_date: "",
};

const baseEndpointName = BaseEndpointNames.MESSAGES;
export const queryKeysMessages = {
  allMessages: "messages",
};

export const fetchMessages = async (
  params?: QueryParams<keyof FetchMessagesParams>
): PromisePaginationData<Message> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const useGetMessages = (
  params?: QueryParams<keyof FetchMessagesParams>
) => {
  return useQuery([queryKeysMessages.allMessages, params], () =>
    fetchMessages(params)
  );
};
