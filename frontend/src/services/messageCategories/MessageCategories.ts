import useAxiosCustom, { PaginationData } from "../api";
import {
  MessageCategory,
  MessageCategoryUpdateData,
  MessageCategoryCreateData,
} from "./types";

export const useGetMessageCategories = () => {
  return useAxiosCustom<PaginationData<MessageCategory>>({
    url: `/message-categories`,
  });
};

export const useEditMessageCategoryById = (
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

export const useIncrementUsesCategoryById = (id: string) => {
  return useAxiosCustom<MessageCategory>({
    url: `/message-categories/${id}/uses`,
    method: "POST",
    manual: true,
    urlParams: false,
  });
};

export const useCreateMessageCategory = (data: MessageCategoryCreateData) => {
  return useAxiosCustom<MessageCategoryCreateData>({
    url: `/message-categories/create`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useDeleteMessageCategoryById = (id: string | null) => {
  return useAxiosCustom<any>({
    url: `/message-categories/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
