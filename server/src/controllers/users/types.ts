import { RequestSearch } from "../types";

export interface RequestQueryUser extends RequestSearch {
  seen_start?: string;
  seen_end?: string;
  privilege?: string;
  created_start?: string;
  created_end?: string;
}

export type RequestQueryLatestEldestMsgs = RequestSearch;
