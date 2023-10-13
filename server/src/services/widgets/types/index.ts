import { WidgetsDocument } from "@models/types";
import { SortQuery, SelectQuery, PopulateSelect } from "@services";
export interface WidgetsFindOptions {
  select?: SelectQuery<WidgetsDocument>;
  populate?: PopulateSelect;
}

export interface ManyWidgetsFindOptions extends WidgetsFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type WidgetCreateData = Pick<WidgetsDocument, "name" | "layout" | "toolbox">;

export type WidgetUpdateData = Partial<WidgetCreateData>;
