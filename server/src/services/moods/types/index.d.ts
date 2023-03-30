import { MoodModel } from "@models/types";
import { PopulateOption, PopulateOptions } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";

export interface MoodFindOptions {
  select?: SelectQuery<MoodModel> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyMoodsFindOptions extends MoodFindOptions {
  sort?: SortQuery<MoodModel> | {};
  skip?: number;
  limit?: number;
}

export interface MoodCreateData extends Pick<MoodModel, "name"> {}

export interface MoodUpdateData
  extends Partial<Pick<MoodModel, "name" | "enabled">> {}
