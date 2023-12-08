import useAxiosCustom, { PaginationData } from "../api";
import { Message } from "./types";

export const useGetMessages = () => {
  return useAxiosCustom<PaginationData<Message>>({
    url: `/messages`,
  });
};
