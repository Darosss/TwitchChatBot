import useAxiosCustom, { IPagination, IResponseData } from "./ApiService";

export interface IUser {
  _id: string;
  twitchId: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  privileges: number;
  points?: number;
  lastSeen?: Date;
  messageCount?: number;
  notes?: string[];
  twitchName?: string;
  twitchCreated?: Date;
  userDisplayName?: string;
  follower?: Date;
}

const getUsersList = () => {
  return useAxiosCustom<IPagination<IUser>>({
    url: `/users`,
  });
};

const getUser = (userId: string) => {
  return useAxiosCustom<IResponseData<IUser>>({
    url: `/users/${userId}`,
  });
};

const editUser = (userId: string, data: Partial<IUser>) => {
  return useAxiosCustom<IUser>({
    url: `/users/${userId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export default { getUsersList, editUser, getUser };