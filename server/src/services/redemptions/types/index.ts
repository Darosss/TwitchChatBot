import { RedemptionModel } from "@models";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";

export interface RedemptionFindOptions {
  select?: SelectQuery<RedemptionModel>;
  populate?: PopulateSelect;
}

export interface ManyRedemptionsFindOptions extends RedemptionFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type RedemptionOptionalData = Partial<Pick<RedemptionModel, "rewardImage" | "message">>;

export interface RedemptionCreateData
  extends Omit<RedemptionModel, "_id" | "rewardImage" | "message">,
    RedemptionOptionalData {}
