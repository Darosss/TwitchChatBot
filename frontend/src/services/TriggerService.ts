import useAxiosCustom, { PaginationData } from "./ApiService";

export type TriggerMode = "WHOLE-WORD" | "STARTS-WITH" | "ALL";

export interface Trigger {
  _id: string;
  name: string;
  enabled: boolean;
  chance: number;
  delay: number;
  uses: number;
  mode: TriggerMode;
  onDelay: boolean;
  words: string[];
  messages: string[];
  createdAt: Date;
  updatedAt: Date;
}

type ITriggerCreateData = Omit<
  Trigger,
  "_id" | "createdAt" | "updatedAt" | "onDelay" | "uses"
>;

type ITriggerUpdateData = Partial<ITriggerCreateData>;

export const getTriggers = () => {
  return useAxiosCustom<PaginationData<Trigger>>({
    url: `/triggers`,
  });
};

export const editTrigger = (commandId: string, data: ITriggerUpdateData) => {
  return useAxiosCustom<Trigger>({
    url: `/triggers/${commandId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const createTrigger = (data: ITriggerCreateData) => {
  return useAxiosCustom<Trigger>({
    url: `/triggers/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const deleteTrigger = (triggerId: string) => {
  return useAxiosCustom<Trigger>({
    url: `/triggers/delete/${triggerId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
