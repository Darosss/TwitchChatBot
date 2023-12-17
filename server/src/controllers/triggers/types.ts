import { RequestSearchDate } from "../types";

export interface RequestTriggerQuery extends RequestSearchDate {
  words?: string;
  messages?: string;
}
