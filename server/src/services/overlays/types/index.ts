import { OverlayModel } from "@models/types";
import { SortQuery, SelectQuery } from "@services";
import { PopulateOption } from "mongoose";

export interface OverlaysFindOptions {
  select?: SelectQuery<OverlayModel>;
  populateSelect?: PopulateOption.select;
}

export interface ManyOverlaysFindOptions extends OverlaysFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type OverlayCreateData = Pick<OverlayModel, "name" | "layout" | "toolbox">;

export type OverlayUpdateData = Partial<OverlayCreateData>;
