import useAxiosCustom, { PaginationData } from "./ApiService";

export interface MessageCategory {
  _id: string;
  category: string;
  messages: string[];
  uses: number;
  createdAt: Date;
  updatedAt: Date;
}

type MessageCategoryCreateData = Pick<MessageCategory, "category" | "messages">;

type IMessageCategoryUpdateData = Partial<MessageCategoryCreateData>;

export const getMessageCategories = () => {
  return useAxiosCustom<PaginationData<MessageCategory>>({
    url: `/message-categories`,
  });
};

export const editMessageCategoryById = (
  id: string,
  data: IMessageCategoryUpdateData
) => {
  return useAxiosCustom<MessageCategory>({
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
  return useAxiosCustom<MessageCategory>({
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
