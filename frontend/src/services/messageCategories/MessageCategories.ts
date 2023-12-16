import useAxiosCustom, {
  PaginationData,
  ResponseData,
  ResponseMessage,
} from "../api";
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
  return useAxiosCustom<
    ResponseData<MessageCategory>,
    MessageCategoryUpdateData
  >({
    url: `/message-categories/${id}`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useIncrementUsesCategoryById = (id: string) => {
  return useAxiosCustom<ResponseData<MessageCategory>>({
    url: `/message-categories/${id}/uses`,
    method: "POST",
    manual: true,
    urlParams: false,
  });
};

export const useCreateMessageCategory = (data: MessageCategoryCreateData) => {
  return useAxiosCustom<
    ResponseData<MessageCategory>,
    MessageCategoryCreateData
  >({
    url: `/message-categories/create`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useDeleteMessageCategoryById = (id: string | null) => {
  return useAxiosCustom<ResponseMessage>({
    url: `/message-categories/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
