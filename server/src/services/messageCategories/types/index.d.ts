import { PopulateOption, PopulateOptions } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";
import { MessageCategoryModel } from "@models/types";

export interface MessageCategoryFindOptions {
  select?: SelectQuery<IStreamSession> | {};
}

export interface ManyMessageCategoriesFindOptions
  extends MessageCategoryFindOptions {
  sort?: SortQuery<MessageCategoryModel> | {};
  skip?: number;
  limit?: number;
}

export interface MessageCategoryData
  extends Omit<
    MessageCategoryModel,
    "_id" | "createdAt" | "updatedAt" | "uses"
  > {}
