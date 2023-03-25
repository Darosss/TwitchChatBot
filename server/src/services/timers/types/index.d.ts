import { TimerModel } from "@models/types";
import { PopulateOption, PopulateOptions } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";

export interface TimerFindOptions {
  select?: SelectQuery<TimerModel> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyTimersFindOptions extends TimerFindOptions {
  sort?: SortQuery<TimerModel> | {};
  skip?: number;
  limit?: number;
}

export interface TimerOptionalData
  extends Partial<Omit<TimerModel, "_id" | "createdAt" | "updatedAt">> {}

export interface TimerCreateData
  extends Pick<TimerModel, "name" | "messages">,
    TimerOptionalData {}

export interface TimerUpdateData
  extends TimerOptionalData,
    Partial<TimerCreateData> {}
