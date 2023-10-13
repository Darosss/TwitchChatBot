import { TriggerModel } from "@models";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";

export interface TriggerFindOptions {
  select?: SelectQuery<TriggerModel>;
  populate?: PopulateSelect;
}

export interface ManyTriggersFindOptions extends TriggerFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type TriggerOptionalData = Partial<Omit<TriggerModel, "_id" | "createdAt" | "updatedAt">>;

export interface TriggerCreateData
  extends Pick<TriggerModel, "name" | "words" | "messages">,
    Omit<TriggerOptionalData, "name" | "messages" | "words"> {}

export interface TriggerUpdateData extends TriggerOptionalData, Partial<TriggerCreateData> {}
