import { IOverlay } from "@models/types";
import { SortQuery, SelectQuery } from "@services/types";
import { PopulateOption, PopulateOptions } from "mongoose";

export interface OverlaysFindOptions {
  select?: SelectQuery<IOverlay> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyOverlaysFindOptions extends OverlaysFindOptions {
  sort?: SortQuery<IOverlay> | {};
  skip?: number;
  limit?: number;
}

export interface OverlayCreateData extends Pick<IOverlay, "name" | "layout"> {}

export interface OverlayUpdateData extends Partial<ChatCommandOptionalData> {}
