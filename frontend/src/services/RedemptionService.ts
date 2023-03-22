import useAxiosCustom, { PaginationData } from "./ApiService";

export interface Redemption {
  _id: string;
  rewardId: string;
  userId: string;
  twitchId: string;
  userName: string;
  userDisplayName: string;
  redemptionDate: Date;
  rewardTitle: string;
  rewardCost: number;
  rewardImage: string;
  message?: string;
}

export const getRedemptions = () => {
  return useAxiosCustom<PaginationData<Redemption>>({
    url: `/redemptions`,
  });
};
