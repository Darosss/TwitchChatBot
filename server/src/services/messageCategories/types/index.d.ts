import { PopulateOption } from "mongoose";
import { SortQuery, SelectQuery } from "@services/types";
import { MessageCategoryModel } from "@models/types";

export interface MessageCategoryFindOptions {
  select?: SelectQuery<IStreamSession>;
  populateSelect?: PopulateOption.select;
}

export interface ManyMessageCategoriesFindOptions extends MessageCategoryFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type MessageCategoryData = Omit<MessageCategoryModel, "_id" | "createdAt" | "updatedAt" | "uses">;

export interface MessageCategoryCreateData extends MessageCategoryData {
  messages: string[];
}
