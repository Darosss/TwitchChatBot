import useAxiosCustom, { IPagination } from "./ApiService";

export interface IChatCommand {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  enabled: boolean;
  aliases: string[];
  messages: string[];
  privilege: number;
  useCount: number;
}

export const getCommands = () => {
  return useAxiosCustom<IPagination<IChatCommand>>({
    url: `/chat-commands`,
  });
};

export const editCommand = (commandId: string, data: Partial<IChatCommand>) => {
  return useAxiosCustom<IChatCommand>({
    url: `/chat-commands/${commandId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const createCommand = (data: Partial<IChatCommand>) => {
  return useAxiosCustom<IChatCommand>({
    url: `/chat-commands/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const deleteCommand = (commandId: string) => {
  return useAxiosCustom<any>({
    url: `/chat-commands/delete/${commandId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
