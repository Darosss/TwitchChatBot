import { AffixModel } from "@models/types";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";

export interface AffixFindOptions {
  select?: SelectQuery<AffixModel>;
  populateSelect?: PopulateSelect;
}

export interface ManyAffixesFindOptions extends AffixFindOptions {
  sort: SortQuery;
  skip?: number;
  limit?: number;
}

export type AffixCreateData = Pick<AffixModel, "name">;

export type AffixUpdateData = Partial<Omit<AffixModel, "_id" | "createdAt" | "updatedAt">>;
