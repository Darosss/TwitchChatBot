import { IRedemption } from "@models/types";
import { PopulateOption, PopulateOptions } from "mongoose";

type SortQuery = { [P in keyof IRedemption]?: 1 | -1 };
type SelectQuery = { [P in keyof IRedemption]?: 1 | 0 };

export interface RedemptionFindOptions {
  select?: SelectQuery | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyRedemptionsFindOptions extends RedemptionFindOptions {
  sort?: SortQuery | {};
  skip?: number;
  limit?: number;
}

export interface RedemptionOptionalData {
  rewardImage?: string;
  message?: string;
}

export interface RedemptionCreateData extends RedemptionOptionalData {
  rewardId: string;
  userId: string;
  userName: string;
  userDisplayName: string;
  redemptionDate: Date;
  rewardTitle: string;
  rewardCost: number;
}
