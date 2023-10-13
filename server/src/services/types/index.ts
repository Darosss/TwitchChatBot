import { SortOrder } from "mongoose";

export type SortQuery = string | { [key: string]: SortOrder | { $meta: "textScore" } } | [string, SortOrder][] | null;

export type SelectQuery<T> = {
  [P in keyof T & AdditionalSelectQueries]?: 1 | 0;
};

interface AdditionalSelectQueries {
  __v: number;
}
