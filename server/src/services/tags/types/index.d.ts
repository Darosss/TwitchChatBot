import { TagModel } from "@models/types";
import { PopulateOption, PopulateOptions } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";

export interface TagFindOptions {
  select?: SelectQuery<TagModel> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyTagsFindOptions extends TagFindOptions {
  sort?: SortQuery<TagModel> | {};
  skip?: number;
  limit?: number;
}

export interface TagCreateData extends Pick<TagModel, "name"> {}

export interface TagUpdateData
  extends Partial<Pick<TagModel, "name" | "enabled">> {}
