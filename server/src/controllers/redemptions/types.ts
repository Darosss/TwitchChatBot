import { RequestSearchDate } from "../types";

export interface RequestRedemptionQuery extends RequestSearchDate {
  receiver?: string;
  cost?: string;
  message?: string;
}
