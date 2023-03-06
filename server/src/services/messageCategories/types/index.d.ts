import { PopulateOption, PopulateOptions } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";
import { IMessageCategory } from "@models/types";

export interface IMessageCategoryFindOptions {
  select?: SelectQuery<IStreamSession> | {};
}

export interface IManyMessageCategoriesFindOptions
  extends IMessageCategoryFindOptions {
  sort?: SortQuery<IMessageCategory> | {};
  skip?: number;
  limit?: number;
}

export interface IMessageCategoryData
  extends Omit<IMessageCategory, "_id" | "createdAt" | "updatedAt"> {}
