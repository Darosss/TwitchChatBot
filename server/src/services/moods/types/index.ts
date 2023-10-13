import { MoodModel } from "@models/types";
import { PopulateOption } from "mongoose";
import { SortQuery, SelectQuery } from "@services";

export interface MoodFindOptions {
  select?: SelectQuery<MoodModel>;
  populateSelect?: PopulateOption.select;
}

export interface ManyMoodsFindOptions extends MoodFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type MoodCreateData = Pick<MoodModel, "name">;
export type MoodUpdateData = Partial<Pick<MoodModel, "name" | "enabled">>;
