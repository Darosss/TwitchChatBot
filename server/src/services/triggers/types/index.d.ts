import { ITrigger } from "@models/types";
import { PopulateOption, PopulateOptions } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";

export interface TriggerFindOptions {
  select?: SelectQuery<ITrigger> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyTriggersFindOptions extends TriggerFindOptions {
  sort?: SortQuery<ITrigger> | {};
  skip?: number;
  limit?: number;
}

export interface TriggerOptionalData
  extends Partial<Omit<ITrigger, "_id" | "createdAt" | "updatedAt">> {}

export interface TriggerCreateData
  extends Pick<ITrigger, "name" | "words" | "messages">,
    TriggerOptionalData {}

export interface TriggerUpdateData
  extends TriggerOptionalData,
    Partial<TriggerCreateData> {}
