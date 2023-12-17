import { RequestSearchDate } from "../types";

export interface RequestQueryMessage extends RequestSearchDate {
  owner?: string;
}
