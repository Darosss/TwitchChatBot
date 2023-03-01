import useAxiosCustom, { IPagination } from "./ApiService";

export interface IRedemption {
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
  return useAxiosCustom<IPagination<IRedemption>>({
    url: `/redemptions`,
  });
};
