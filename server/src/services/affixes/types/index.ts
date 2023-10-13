import { AffixModel } from "@models/types";
import { PopulateOption } from "mongoose";
import { SortQuery, SelectQuery } from "@services";

export interface AffixFindOptions {
  select?: SelectQuery<AffixModel>;
  populateSelect?: PopulateOption.select;
}

export interface ManyAffixesFindOptions extends AffixFindOptions {
  sort: SortQuery;
  skip?: number;
  limit?: number;
}

export type AffixCreateData = Pick<AffixModel, "name">;

export type AffixUpdateData = Partial<Omit<AffixModel, "_id" | "createdAt" | "updatedAt">>;
