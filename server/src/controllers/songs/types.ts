import { RequestSearchDate } from "../types";

export interface RequestSongsQuery extends RequestSearchDate {
  customId?: string;
}
