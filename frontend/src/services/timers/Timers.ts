import useAxiosCustom, { PaginationData } from "../api";
import { Timer, TimerUpdateData, TimerCreateData } from "./types";

export const useGetTimers = () => {
  return useAxiosCustom<PaginationData<Timer>>({
    url: `/timers`,
  });
};

export const useEditTimer = (commandId: string, data: TimerUpdateData) => {
  return useAxiosCustom<TimerUpdateData>({
    url: `/timers/${commandId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const useCreateTimer = (data: TimerCreateData) => {
  return useAxiosCustom<TimerCreateData>({
    url: `/timers/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useDeleteTimer = (timerId: string) => {
  return useAxiosCustom<Timer>({
    url: `/timers/delete/${timerId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
