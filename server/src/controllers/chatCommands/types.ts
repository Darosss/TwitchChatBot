import { RequestSearchDate } from "../types";

export interface RequestCommandsQuery extends RequestSearchDate {
  created?: string;
  privilege?: string;
  description?: string;
  aliases?: string;
  messages?: string;
}
