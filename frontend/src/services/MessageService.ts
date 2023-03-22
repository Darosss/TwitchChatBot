import useAxiosCustom, { PaginationData } from "./ApiService";
import { User } from "./UserService";

export interface Message {
  _id: string;
  message: string;
  date: Date;
  owner: User;
  ownerUsername: string;
}

export const getMessages = () => {
  return useAxiosCustom<PaginationData<Message>>({
    url: `/messages`,
  });
};
