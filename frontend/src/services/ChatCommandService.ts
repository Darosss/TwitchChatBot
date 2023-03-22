import useAxiosCustom, { PaginationData } from "./ApiService";

export interface ChatCommand {
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

type IChatCommandCreateData = Omit<
  ChatCommand,
  "_id" | "createdAt" | "updatedAt" | "useCount"
>;

type IChatCommandUpdateData = Partial<IChatCommandCreateData>;

export const getCommands = () => {
  return useAxiosCustom<PaginationData<ChatCommand>>({
    url: `/chat-commands`,
  });
};

export const editCommand = (
  commandId: string,
  data: IChatCommandUpdateData
) => {
  return useAxiosCustom<ChatCommand>({
    url: `/chat-commands/${commandId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const createCommand = (data: IChatCommandCreateData) => {
  return useAxiosCustom<ChatCommand>({
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
