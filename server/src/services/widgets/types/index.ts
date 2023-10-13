import { IWidget } from "@models/types";
import { SortQuery, SelectQuery } from "@services";
import { PopulateOption } from "mongoose";

export interface WidgetsFindOptions {
  select?: SelectQuery<IWidget>;
  populateSelect?: PopulateOption.select;
}

export interface ManyWidgetsFindOptions extends WidgetsFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type WidgetCreateData = Pick<IWidget, "name" | "layout" | "toolbox">;

export type WidgetUpdateData = Partial<WidgetCreateData>;
