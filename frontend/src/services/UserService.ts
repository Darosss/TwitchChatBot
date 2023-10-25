import useAxiosCustom, { PaginationData, ResponseData } from "./ApiService";
import { Message } from "./MessageService";
import { Redemption } from "./RedemptionService";

export interface User {
  _id: string;
  twitchId: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  privileges: number;
  points?: number;
  watchTime?: number;
  lastSeen?: Date;
  messageCount?: number;
  notes?: string[];
  twitchName?: string;
  twitchCreated?: Date;
  follower?: Date;
}

interface UserUpdateData
  extends Partial<
    Omit<User, "_id" | "twitchId" | "twitchName" | "twitchCreated">
  > {}

interface FirstAndLatestMsgs {
  firstMessages: Message[];
  latestMessages: Message[];
}

interface GetUsersByIds {
  data: User[];
  count: number;
}

export const useGetUsersList = (urlParams = true, customUrlParams = "") => {
  return useAxiosCustom<PaginationData<User>>({
    url: `/users?${customUrlParams}`,
    urlParams: urlParams,
  });
};

export const useGetUsersByIds = (ids: string[]) => {
  return useAxiosCustom<GetUsersByIds>({
    url: `/users/by-ids/${ids.join(",")}`,
  });
};

export const useGetUser = (userId: string) => {
  return useAxiosCustom<ResponseData<User>>({
    url: `/users/${userId}`,
  });
};

export const useEditUser = (userId: string, data: UserUpdateData) => {
  return useAxiosCustom<User>({
    url: `/users/${userId}`,
    method: "POST",
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
  return useAxiosCustom<{ data: FirstAndLatestMsgs }>({
    url: `/users/${userId}/messages/latest-eldest`,
  });
};

export const useGetUserRedemptions = (userId: string) => {
  return useAxiosCustom<PaginationData<Redemption>>({
    url: `/users/${userId}/redemptions`,
  });
};
