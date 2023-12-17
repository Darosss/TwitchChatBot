import { RequestSearchDate } from "../types";

export interface RequestQuerySession extends RequestSearchDate {
  tags?: string;
  categories?: string;
}
