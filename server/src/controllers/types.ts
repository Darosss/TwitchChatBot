import { ParamsDictionary, Query } from "express-serve-static-core";

export interface RequestParams extends ParamsDictionary {
  id: string;
}

export interface RequestQuery extends Query {
  limit?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface RequestSearch extends RequestQuery {
  search_name?: string;
}

export interface RequestSearchDate extends RequestSearch {
  start_date?: string;
  end_date?: string;
}
