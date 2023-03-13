import useAxiosCustom, { IPagination } from "./ApiService";

export interface IMessageCategory {
  _id: string;
  category: string;
  messages: string[];
  uses: number;
  createdAt: Date;
  updatedAt: Date;
}

export const getMessageCategories = () => {
  return useAxiosCustom<IPagination<IMessageCategory>>({
    url: `/message-categories`,
  });
};

export const editMessageCategoryById = (
  id: string,
  data: Partial<IMessageCategory>
) => {
  return useAxiosCustom<IMessageCategory>({
    url: `/message-categories/${id}`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const incrementUsesCategoryById = (id: string) => {
  return useAxiosCustom<IMessageCategory>({
    url: `/message-categories/${id}/uses`,
    method: "POST",
    manual: true,
    urlParams: false,
  });
};

export const createMessageCategory = (
  data: Pick<IMessageCategory, "category" | "messages">
) => {
  return useAxiosCustom<IMessageCategory>({
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
