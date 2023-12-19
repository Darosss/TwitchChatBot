import useAxiosCustom, { PaginationData, ResponseData } from "../api";
import { Message } from "../messages";
import { Redemption } from "../redemptions";
import {
  User,
  UserUpdateData,
  FirstAndLatestMsgs,
  GetUsersByIdsResponse,
} from "./types";

export const useGetUsersList = (urlParams = true, customUrlParams = "") => {
  return useAxiosCustom<PaginationData<User>>({
    url: `/users${customUrlParams ? `?${customUrlParams}` : ""}`,
    urlParams: urlParams,
  });
};

export const useGetUsersByIds = (ids: string[]) => {
  return useAxiosCustom<GetUsersByIdsResponse>({
    url: `/users/by-ids/${ids.join(",")}`,
  });
};

export const useGetUser = (userId: string) => {
  return useAxiosCustom<ResponseData<User>>({
    url: `/users/${userId}`,
  });
};

export const useEditUser = (userId: string, data: UserUpdateData) => {
  return useAxiosCustom<ResponseData<User>, UserUpdateData>({
    url: `/users/${userId}`,
    method: "PATCH",
    bodyData: data,
    manual: true,
  });
};

export const useGetUserMessages = (userId: string) => {
  return useAxiosCustom<PaginationData<Message>>({
    url: `/users/${userId}/messages`,
  });
};

export const useGetLatestEldestMsgs = (userId: string) => {
  return useAxiosCustom<ResponseData<FirstAndLatestMsgs>>({
    url: `/users/${userId}/messages/latest-eldest`,
  });
};

export const useGetUserRedemptions = (userId: string) => {
  return useAxiosCustom<PaginationData<Redemption>>({
    url: `/users/${userId}/redemptions`,
  });
};
