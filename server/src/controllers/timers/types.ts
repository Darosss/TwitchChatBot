import { RequestSearchDate } from "../types";

export interface RequestTimerQuery extends RequestSearchDate {
  messages?: string;
}
