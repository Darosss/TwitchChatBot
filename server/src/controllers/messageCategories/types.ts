import { RequestSearchDate } from "../types";

export interface RequestQueryMessageCategories extends RequestSearchDate {
  messages?: string;
}
