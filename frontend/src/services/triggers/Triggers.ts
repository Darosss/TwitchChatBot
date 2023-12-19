import useAxiosCustom, {
  PaginationData,
  ResponseData,
  ResponseMessage,
} from "../api";
import { Trigger, TriggerUpdateData, TriggerCreateData } from "./types";

export const useGetTriggers = () => {
  return useAxiosCustom<PaginationData<Trigger>>({
    url: `/triggers`,
  });
};

export const useEditTrigger = (commandId: string, data: TriggerUpdateData) => {
  return useAxiosCustom<ResponseData<Trigger>, TriggerUpdateData>({
    url: `/triggers/${commandId}`,
    method: "PATCH",
    bodyData: data,
    manual: true,
  });
};

export const useCreateTrigger = (data: TriggerCreateData) => {
  return useAxiosCustom<ResponseData<Trigger>, TriggerCreateData>({
    url: `/triggers/create`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useDeleteTrigger = (triggerId: string | null) => {
  return useAxiosCustom<ResponseMessage>({
    url: `/triggers/delete/${triggerId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
