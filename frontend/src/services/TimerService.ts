import useAxiosCustom, { PaginationData } from "./ApiService";

export interface Timer {
  _id: string;
  name: string;
  enabled: boolean;
  uses: number;
  messages: string[];
  description: string;
  nonFollowMulti: boolean;
  nonSubMulti: boolean;
  reqPoints: number;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

interface TimerCreateData
  extends Omit<Timer, "_id" | "createdAt" | "updatedAt" | "points" | "uses"> {}

interface TimerUpdateData extends Partial<TimerCreateData> {}

export const getTimers = () => {
  return useAxiosCustom<PaginationData<Timer>>({
    url: `/timers`,
  });
};

export const editTimer = (commandId: string, data: TimerUpdateData) => {
  return useAxiosCustom<Timer>({
    url: `/timers/${commandId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const createTimer = (data: TimerCreateData) => {
  return useAxiosCustom<Timer>({
    url: `/timers/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const deleteTimer = (timerId: string) => {
  return useAxiosCustom<Timer>({
    url: `/timers/delete/${timerId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
