import { TagModel } from "@models/types";
import { PopulateOption } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";

export interface TagFindOptions {
  select?: SelectQuery<TagModel>;
  populateSelect?: PopulateOption.select;
}

export interface ManyTagsFindOptions extends TagFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type TagCreateData = Pick<TagModel, "name">;

export type TagUpdateData = Partial<Pick<TagModel, "name" | "enabled">>;
