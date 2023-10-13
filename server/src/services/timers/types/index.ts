import { TimerModel } from "@models/types";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";

export interface TimerFindOptions {
  select?: SelectQuery<TimerModel>;
  populateSelect?: PopulateSelect;
}

export interface ManyTimersFindOptions extends TimerFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type TimerOptionalData = Partial<Omit<TimerModel, "_id" | "createdAt" | "updatedAt">>;

export interface TimerCreateData
  extends Pick<TimerModel, "name" | "messages">,
    Omit<TimerOptionalData, "name" | "messages"> {}

export interface TimerUpdateData extends TimerOptionalData, Partial<TimerCreateData> {}
