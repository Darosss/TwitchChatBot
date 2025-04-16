import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  BaseEndpointNames,
  customAxios,
  onErrorHelperService,
  OnErrorHelperServiceAction,
  OnErrorHelperServiceConcern,
  PromiseBackendData,
  PromisePaginationData,
  QueryParams,
  refetchDataFunctionHelper,
} from "../api";
import { Message } from "../messages";
import { Redemption } from "../redemptions";
import {
  User,
  UserUpdateData,
  FirstAndLatestMsgs,
  FetchUsersParams,
} from "./types";

export const fetchUsersDefaultParams: Required<FetchUsersParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "asc",
  sortBy: "createdAt",
  privilege: 0,
  seen_start: "",
  seen_end: "",
  created_start: "",
  created_end: "",
};

const baseEndpointName = BaseEndpointNames.USERS;
export const queryKeysUsers = {
  allUsers: "users" as string,
  userById: (id: string) => ["users", id] as [string, string],
  userMessages: (id: string) => ["users-messages", id] as [string, string],
  userFirstLatestMessages: (id: string) =>
    ["users-messages-latest-eldest", id] as [string, string],
  getUsersByIds: (id: string[]) =>
    ["get-users-by-ids", id.join(",")] as [string, string],
  userRedemptions: (id: string) =>
    ["users-redemptions", id] as [string, string],
};

export const fetchUsers = async (
  params?: QueryParams<keyof FetchUsersParams>
): PromisePaginationData<User> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};
export const fetchUserById = async (id: string): PromiseBackendData<User> => {
  const response = await customAxios.get(`/${baseEndpointName}/${id}`);
  return response.data;
};

export const fetchUserMessages = async (
  id: string
): PromisePaginationData<Message> => {
  const response = await customAxios.get(`/${baseEndpointName}/${id}/messages`);
  return response.data;
};

export const fetchUserLatestEldestMsgs = async (
  id: string
): PromiseBackendData<FirstAndLatestMsgs> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/${id}/messages/latest-eldest`
  );
  return response.data;
};

export const fetchUserRedemptions = async (
  id: string
): PromisePaginationData<Redemption> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/${id}/redemptions`
  );
  return response.data;
};
export const fetchUsersByIds = async (
  ids: string[]
): PromisePaginationData<User> => {
  const response = await customAxios.get(
    `/${baseEndpointName}/users/by-ids/${ids.join(",")}`
  );
  return response.data;
};

export const editUser = async ({
  id,
  updatedUser,
}: {
  id: string;
  updatedUser: UserUpdateData;
}): PromiseBackendData<User> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedUser
  );
  return response.data;
};

export const useGetUsers = (params?: QueryParams<keyof FetchUsersParams>) => {
  return useQuery([queryKeysUsers.allUsers, params], () => fetchUsers(params));
};

export const useGetUser = (id: string) => {
  return useQuery(queryKeysUsers.userById(id), () => fetchUserById(id));
};

export const useEditUser = () => {
  const refetchUsers = useRefetchUsersData();
  return useMutation(editUser, {
    onSuccess: refetchUsers,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.USER,
        OnErrorHelperServiceAction.EDIT
      );
    },
  });
};

export const useGetUserMessages = (id: string) => {
  return useQuery(queryKeysUsers.userMessages(id), () => fetchUserMessages(id));
};

export const useGetLatestEldestMsgs = (id: string) => {
  return useQuery(queryKeysUsers.userFirstLatestMessages(id), () =>
    fetchUserLatestEldestMsgs(id)
  );
};

export const useGetUsersByIds = (ids: string[]) => {
  return useQuery(queryKeysUsers.getUsersByIds(ids), () =>
    fetchUsersByIds(ids)
  );
};

export const useGetUserRedemptions = (id: string) => {
  return useQuery(queryKeysUsers.userRedemptions(id), () =>
    fetchUserRedemptions(id)
  );
};

export const useRefetchUsersData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysUsers,
    "allUsers",
    queryClient,
    null,
    exact
  );
};
