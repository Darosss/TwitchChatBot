import { ITrigger } from "@models/types";
import { PopulateOption, PopulateOptions } from "mongoose";

type SortQuery = { [P in keyof ITrigger]?: 1 | -1 };
type SelectQuery = { [P in keyof ITrigger]?: 1 | 0 };

export interface TriggerFindOptions {
  select?: SelectQuery | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyTriggersFindOptions extends TriggerFindOptions {
  sort?: SortQuery | {};
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

export interface TriggerUpdateData extends TriggerOptionalData {
  name?: string;
}
