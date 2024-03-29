import { TagModel } from "@models";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";

export interface TagFindOptions {
  select?: SelectQuery<TagModel>;
  populate?: PopulateSelect;
}

export interface ManyTagsFindOptions extends TagFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type TagCreateData = Pick<TagModel, "name">;

export type TagUpdateData = Partial<Pick<TagModel, "name" | "enabled">>;
