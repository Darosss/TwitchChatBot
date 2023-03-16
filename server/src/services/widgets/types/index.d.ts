import { IWidget } from "@models/types";
import { SortQuery, SelectQuery } from "@services/types";
import { PopulateOption, PopulateOptions } from "mongoose";

export interface WidgetsFindOptions {
  select?: SelectQuery<IWidget> | {};
  populateSelect?: PopulateOption.select;
}

export interface ManyWidgetsFindOptions extends WidgetsFindOptions {
  sort?: SortQuery<IWidget> | {};
  skip?: number;
  limit?: number;
}

export interface WidgetCreateData extends Pick<IWidget, "name" | "layout"> {}

export interface WidgetUpdateData extends Partial<ChatCommandOptionalData> {}
