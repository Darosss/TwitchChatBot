import useAxiosCustom, { IPagination } from "./ApiService";
import { IUser } from "./UserService";

export interface IMessage {
  _id: string;
  message: string;
  date: Date;
  owner: IUser;
  ownerUsername: string;
}

export const getMessages = () => {
  return useAxiosCustom<IPagination<IMessage>>({
    url: `/messages`,
  });
};
