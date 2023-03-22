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
  userDisplayName?: string;
  follower?: Date;
}

type UserUpdateData = Partial<
  Omit<User, "_id" | "twitchId" | "twitchName" | "twitchCreated">
>;

interface FirstAndLatestMsgs {
  firstMessages: Message[];
  latestMessages: Message[];
}

export const getUsersList = () => {
  return useAxiosCustom<PaginationData<User>>({
    url: `/users`,
  });
};

export const getUser = (userId: string) => {
  return useAxiosCustom<ResponseData<User>>({
    url: `/users/${userId}`,
  });
};

export const editUser = (userId: string, data: UserUpdateData) => {
  return useAxiosCustom<User>({
    url: `/users/${userId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const getUserMessages = (userId: string) => {
  return useAxiosCustom<PaginationData<Message>>({
    url: `/users/${userId}/messages`,
  });
};

export const getLatestEldestMsgs = (userId: string) => {
  return useAxiosCustom<{ data: FirstAndLatestMsgs }>({
    url: `/users/${userId}/messages/latest-eldest`,
  });
};

export const getUserRedemptions = (userId: string) => {
  return useAxiosCustom<PaginationData<Redemption>>({
    url: `/users/${userId}/redemptions`,
  });
};
