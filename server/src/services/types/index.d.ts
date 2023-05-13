import { SortOrder } from "mongoose";

export type SortQuery = string | { [string]: SortOrder | { $meta: "textScore" } } | [string, SortOrder][] | null;

export interface SelectQuery<T> {
  [P in keyof<T>]?: 1 | 0;
}
