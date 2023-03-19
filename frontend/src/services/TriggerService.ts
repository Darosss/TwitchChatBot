import useAxiosCustom, { IPagination } from "./ApiService";

export type ITriggerMode = "WHOLE-WORD" | "STARTS-WITH" | "ALL";

export interface ITrigger {
  _id: string;
  name: string;
  enabled: boolean;
  chance: number;
  delay: number;
  uses: number;
  mode: ITriggerMode;
  onDelay: boolean;
  words: string[];
  messages: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const getTriggers = () => {
  return useAxiosCustom<IPagination<ITrigger>>({
    url: `/triggers`,
  });
};

export const editTrigger = (commandId: string, data: Partial<ITrigger>) => {
  return useAxiosCustom<ITrigger>({
    url: `/triggers/${commandId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const createTrigger = (data: Partial<ITrigger>) => {
  return useAxiosCustom<ITrigger>({
    url: `/triggers/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const deleteTrigger = (triggerId: string) => {
  return useAxiosCustom<ITrigger>({
    url: `/triggers/delete/${triggerId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
