import { IRedemption } from "@models/types";
import { PopulateOption, PopulateOptions } from "mongoose";

import { SortQuery, SelectQuery } from "@services/types";

export interface RedemptionFindOptions {
  select?: SelectQuery<IRedemption> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyRedemptionsFindOptions extends RedemptionFindOptions {
  sort?: SortQuery<IRedemption> | {};
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
