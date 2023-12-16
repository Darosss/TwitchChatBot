import useAxiosCustom, {
  PaginationData,
  ResponseData,
  ResponseMessage,
} from "../api";
import { Timer, TimerUpdateData, TimerCreateData } from "./types";

export const useGetTimers = () => {
  return useAxiosCustom<PaginationData<Timer>>({
    url: `/timers`,
  });
};

export const useEditTimer = (commandId: string, data: TimerUpdateData) => {
  return useAxiosCustom<ResponseData<Timer>, TimerUpdateData>({
    url: `/timers/${commandId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const useCreateTimer = (data: TimerCreateData) => {
  return useAxiosCustom<ResponseData<Timer>, TimerCreateData>({
    url: `/timers/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useDeleteTimer = (timerId: string | null) => {
  return useAxiosCustom<ResponseMessage>({
    url: `/timers/delete/${timerId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
