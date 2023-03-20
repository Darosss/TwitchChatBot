import useAxiosCustom, { IPagination, IResponseData } from "./ApiService";
import { IMessage } from "./MessageService";
import { IRedemption } from "./RedemptionService";

export interface IUser {
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

type IUserUpdateData = Omit<
  IUser,
  "_id" | "twitchId" | "twitchName" | "twitchCreated"
>;

interface FirstAndLatestMsgs {
  firstMessages: IMessage[];
  latestMessages: IMessage[];
}

export const getUsersList = () => {
  return useAxiosCustom<IPagination<IUser>>({
    url: `/users`,
  });
};

export const getUser = (userId: string) => {
  return useAxiosCustom<IResponseData<IUser>>({
    url: `/users/${userId}`,
  });
};

export const editUser = (userId: string, data: IUserUpdateData) => {
  return useAxiosCustom<IUser>({
    url: `/users/${userId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const getUserMessages = (userId: string) => {
  return useAxiosCustom<IPagination<IMessage>>({
    url: `/users/${userId}/messages`,
  });
};

export const getLatestEldestMsgs = (userId: string) => {
  return useAxiosCustom<{ data: FirstAndLatestMsgs }>({
    url: `/users/${userId}/messages/latest-eldest`,
  });
};

export const getUserRedemptions = (userId: string) => {
  return useAxiosCustom<IPagination<IRedemption>>({
    url: `/users/${userId}/redemptions`,
  });
};
