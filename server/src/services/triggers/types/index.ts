import { TriggerModel } from "@models/types";
import { PopulateOption } from "mongoose";
import { SortQuery, SelectQuery } from "@services";

export interface TriggerFindOptions {
  select?: SelectQuery<TriggerModel>;
  populateSelect?: PopulateOption.select;
}

export interface ManyTriggersFindOptions extends TriggerFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type TriggerOptionalData = Partial<Omit<TriggerModel, "_id" | "createdAt" | "updatedAt">>;

export interface TriggerCreateData extends Pick<TriggerModel, "name" | "words" | "messages">, TriggerOptionalData {}

export interface TriggerUpdateData extends TriggerOptionalData, Partial<TriggerCreateData> {}
