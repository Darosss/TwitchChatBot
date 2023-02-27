import { PopulateOption, PopulateOptions } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";
import { IStreamSession } from "@models/types";

export interface IStreamSessionFindOptions {
  select?: SelectQuery<IStreamSession> | {};
}

export interface IManyStreamSessionsFindOptions
  extends IStreamSessionFindOptions {
  sort?: SortQuery<IStreamSession> | {};
  skip?: number;
  limit?: number;
}

export interface IStreamSessionOptionalData
  extends Partial<Omit<IStreamSession, "sessionStart">> {}

export interface IStreamSessionCreateData extends IStreamSessionOptionalData {
  sessionStart: Date;
}

export interface IStreamSessionStatisticOptions {
  limitTopMessageUsers?: number;
  limitTopRedemptionsUsers?: number;
  limitMostUsedWords?: number;
  limitViewers?: number;
}
