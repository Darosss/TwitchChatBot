import { SortQuery, SelectQuery } from "@services";
import { BadgeModel } from "@models";

export interface BadgeFindOptions {
  select?: SelectQuery<BadgeModel>;
}

export interface ManyBadgesFindOptions extends BadgeFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type BadgeUpdateData = Partial<Omit<BadgeModel, "_id" | "createdAt" | "updatedAt">>;

export type BadgeCreateData = Required<BadgeUpdateData>;

interface DeleteBadgeImagesParams {
  name: string;
  extension: string;
  sizesToDelete: number[];
}

export type DeleteBadgeImagesFn = (params: DeleteBadgeImagesParams) => Promise<string | undefined>;
