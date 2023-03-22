import { TriggerModel } from "@models/types";
import { PopulateOption, PopulateOptions } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";

export interface TriggerFindOptions {
  select?: SelectQuery<TriggerModel> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyTriggersFindOptions extends TriggerFindOptions {
  sort?: SortQuery<TriggerModel> | {};
  skip?: number;
  limit?: number;
}

export interface TriggerOptionalData
  extends Partial<Omit<TriggerModel, "_id" | "createdAt" | "updatedAt">> {}

export interface TriggerCreateData
  extends Pick<TriggerModel, "name" | "words" | "messages">,
    TriggerOptionalData {}

export interface TriggerUpdateData
  extends TriggerOptionalData,
    Partial<TriggerCreateData> {}
