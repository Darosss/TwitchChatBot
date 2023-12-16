import useAxiosCustom, {
  PaginationData,
  ResponseData,
  ResponseMessage,
} from "../api";
import { Tag, TagCreateData, TagUpdateData } from "./types";

export const useGetTags = (urlParams = true) => {
  return useAxiosCustom<PaginationData<Tag>>({
    url: `/tags`,
    urlParams: urlParams,
  });
};

export const useEditTag = (id: string, data: TagUpdateData) => {
  return useAxiosCustom<ResponseData<Tag>, TagUpdateData>({
    url: `/tags/${id}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const useCreateTag = (data: TagCreateData) => {
  return useAxiosCustom<ResponseData<Tag>, TagCreateData>({
    url: `/tags/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useDeleteTag = (id: string | null) => {
  return useAxiosCustom<ResponseMessage>({
    url: `/tags/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
