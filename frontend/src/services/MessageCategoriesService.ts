import useAxiosCustom, { IPagination } from "./ApiService";

export interface IMessageCategory {
  _id: string;
  category: string;
  messages: string[];
  uses: number;
  createdAt: Date;
  updatedAt: Date;
}

type IMessageCategoryCreateData = Pick<
  IMessageCategory,
  "category" | "messages"
>;

type IMessageCategoryUpdateData = Partial<IMessageCategoryCreateData>;

export const getMessageCategories = () => {
  return useAxiosCustom<IPagination<IMessageCategory>>({
    url: `/message-categories`,
  });
};

export const editMessageCategoryById = (
  id: string,
  data: IMessageCategoryUpdateData
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

export const createMessageCategory = (data: IMessageCategoryCreateData) => {
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
