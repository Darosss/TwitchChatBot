import { RedemptionModel } from "@models/types";
import { PopulateOption, PopulateOptions } from "mongoose";

import { SortQuery, SelectQuery } from "@services/types";

export interface RedemptionFindOptions {
  select?: SelectQuery<RedemptionModel> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyRedemptionsFindOptions extends RedemptionFindOptions {
  sort?: SortQuery<RedemptionModel> | {};
  skip?: number;
  limit?: number;
}

export interface RedemptionOptionalData
  extends Partial<Pick<RedemptionModel, "rewardImage" | "message">> {}

export interface RedemptionCreateData
  extends Omit<RedemptionModel, "_id" | "rewardImage" | "message">,
    RedemptionOptionalData {}
