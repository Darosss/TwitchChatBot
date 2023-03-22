import { PopulateOption, PopulateOptions } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";
import { StreamSessionModel } from "@models/types";

export interface StreamSessionFindOptions {
  select?: SelectQuery<StreamSessionModel> | {};
}

export interface ManyStreamSessionsFindOptions
  extends StreamSessionFindOptions {
  sort?: SortQuery<StreamSessionModel> | {};
  skip?: number;
  limit?: number;
}

export interface StreamSessionOptionalData
  extends Partial<Omit<StreamSessionModel, "sessionStart">> {}

export interface StreamSessionCreateData extends StreamSessionOptionalData {
  sessionStart: Date;
}

export interface StreamSessionStatisticOptions {
  limitTopMessageUsers?: number;
  limitTopRedemptionsUsers?: number;
  limitMostUsedWords?: number;
  limitViewers?: number;
}
