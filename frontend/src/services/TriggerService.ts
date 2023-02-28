import useAxiosCustom, { IPagination } from "./ApiService";

export interface ITrigger {
  _id: string;
  name: string;
  enabled: boolean;
  chance: number;
  delay: number;
  onDelay: boolean;
  words: string[];
  messages: string[];
  createdAt: Date;
  updatedAt: Date;
}

const getTriggers = () => {
  return useAxiosCustom<IPagination<ITrigger>>({
    url: `/triggers`,
  });
};

const editTrigger = (commandId: string, data: Partial<ITrigger>) => {
  return useAxiosCustom<ITrigger>({
    url: `/triggers/${commandId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

const createTrigger = (data: Partial<ITrigger>) => {
  return useAxiosCustom<ITrigger>({
    url: `/triggers/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

const deleteTrigger = (triggerId: string) => {
  return useAxiosCustom<any>({
    url: `/triggers/delete/${triggerId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
export default { getTriggers, editTrigger, createTrigger, deleteTrigger };
