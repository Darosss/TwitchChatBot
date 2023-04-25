import { AffixM, AffixModel } from "@models/types";
import { PopulateOption, PopulateOptions } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";

export interface AffixFindOptions {
  select?: SelectQuery<AffixModel> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyAffixesFindOptions extends AffixFindOptions {
  sort?: SortQuery<AffixModel> | {};
  skip?: number;
  limit?: number;
}

export interface AffixCreateData extends Pick<AffixModel, "name"> {}

export interface AffixUpdateData
  extends Partial<Omit<AffixModel, "_id" | "createdAt" | "updatedAt">> {}
