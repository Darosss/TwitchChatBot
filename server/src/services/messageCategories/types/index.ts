import { SortQuery, SelectQuery, PopulateSelect } from "@services";
import { MessageCategoryDocument, MessageCategoryModel } from "@models";

export interface MessageCategoryFindOptions {
  select?: SelectQuery<MessageCategoryDocument>;
  populate?: PopulateSelect;
}

export interface ManyMessageCategoriesFindOptions extends MessageCategoryFindOptions {
  sort?: SortQuery;
  skip?: number;
  limit?: number;
}

export type MessageCategoryData = Omit<MessageCategoryModel, "_id" | "createdAt" | "updatedAt" | "uses">;

export interface MessageCategoryCreateData extends Omit<MessageCategoryData, "messages"> {
  messages: string[];
}
