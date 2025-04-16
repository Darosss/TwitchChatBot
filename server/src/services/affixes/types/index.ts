import { AffixModel } from "@models";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";

export interface AffixFindOptions {
  select?: SelectQuery<AffixModel>;
  populate?: PopulateSelect;
}

export interface ManyAffixesFindOptions extends AffixFindOptions {
  sort: SortQuery;
  skip?: number;
  limit?: number;
}

export type AffixCreateData = Pick<AffixModel, "name"> & Partial<Omit<AffixModel, "_id" | "createdAt" | "updatedAt">>;
export type AffixUpdateData = Partial<Omit<AffixModel, "_id" | "createdAt" | "updatedAt">>;
