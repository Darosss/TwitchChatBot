import useAxiosCustom, { PaginationData } from "./ApiService";
import { Mood } from "./MoodService";
import { Personality } from "./PersonalityService";
import { Tag } from "./TagService";

export interface MessageCategory {
  _id: string;
  name: string;
  enabled: boolean;
  messages: [string, number][];
  uses: number;
  personality: Personality;
  tag: Tag;
  mood: Mood;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageCategoryCreateData
  extends Omit<
    MessageCategory,
    | "_id"
    | "createdAt"
    | "updatedAt"
    | "uses"
    | "personality"
    | "tag"
    | "mood"
    | "messages"
  > {
  messages: string[];
  personality: string;
  tag: string;
  mood: string;
}

interface MessageCategoryUpdateData
  extends Partial<MessageCategoryCreateData> {}

export const getMessageCategories = () => {
  return useAxiosCustom<PaginationData<MessageCategory>>({
    url: `/message-categories`,
  });
};

export const editMessageCategoryById = (
  id: string,
  data: MessageCategoryUpdateData
) => {
  return useAxiosCustom<MessageCategoryUpdateData>({
    url: `/message-categories/${id}`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const incrementUsesCategoryById = (id: string) => {
  return useAxiosCustom<MessageCategory>({
    url: `/message-categories/${id}/uses`,
    method: "POST",
    manual: true,
    urlParams: false,
  });
};

export const createMessageCategory = (data: MessageCategoryCreateData) => {
  return useAxiosCustom<MessageCategoryCreateData>({
    url: `/message-categories/create`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const deleteMessageCategoryById = (id: string) => {
  return useAxiosCustom<any>({
    url: `/message-categories/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
