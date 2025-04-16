import { DefaultRequestParams } from "../api";

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

export interface FetchRedemptionsParams
  extends DefaultRequestParams<keyof Redemption> {
  message?: string;
  receiver?: string;
  cost?: number;
  start_date?: string;
  end_date?: string;
}
