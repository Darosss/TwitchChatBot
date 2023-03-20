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

export interface RedemptionOptionalData
  extends Partial<Pick<IRedemption, "rewardImage" | "message">> {}

export interface RedemptionCreateData
  extends Omit<IRedemption, "_id" | "rewardImage" | "message">,
    RedemptionOptionalData {}
