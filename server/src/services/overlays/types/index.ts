import { OverlayModel } from "@models";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";

export interface OverlaysFindOptions {
  select?: SelectQuery<OverlayModel>;
  populate?: PopulateSelect;
}

export interface ManyOverlaysFindOptions extends OverlaysFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type OverlayCreateData = Pick<OverlayModel, "name" | "layout" | "toolbox">;

export interface OverlayUpdateData extends Partial<OverlayCreateData>, Pick<OverlayModel, "styles"> {}
