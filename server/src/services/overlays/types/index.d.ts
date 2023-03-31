import { OverlayModel } from "@models/types";
import { SortQuery, SelectQuery } from "@services/types";
import { PopulateOption, PopulateOptions } from "mongoose";

export interface OverlaysFindOptions {
  select?: SelectQuery<OverlayModel> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyOverlaysFindOptions extends OverlaysFindOptions {
  sort?: SortQuery<OverlayModel> | {};
  skip?: number;
  limit?: number;
}

export interface OverlayCreateData
  extends Pick<OverlayModel, "name" | "layout" | "toolbox"> {}

export interface OverlayUpdateData extends Partial<OverlayCreateData> {}
