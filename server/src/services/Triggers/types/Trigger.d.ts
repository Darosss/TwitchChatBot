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

export interface TriggerOptionalData {
  enabled?: boolean;
  delay?: number;
  onDelay?: boolean;
  words?: string[];
  messages?: number;
  chance?: number;
}

export interface TriggerCreateData extends TriggerOptionalData {
  name: string;
}

export interface TriggerUpdateData
  extends TriggerOptionalData,
    Partial<TriggerCreateData> {}
