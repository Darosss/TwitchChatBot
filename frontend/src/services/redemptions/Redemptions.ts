import useAxiosCustom, { PaginationData } from "../api";
import { Redemption } from "./types";

export const useGetRedemptions = () => {
  return useAxiosCustom<PaginationData<Redemption>>({
    url: `/redemptions`,
  });
};
