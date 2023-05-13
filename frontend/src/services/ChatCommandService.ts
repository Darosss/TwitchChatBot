import useAxiosCustom, { PaginationData } from "./ApiService";
import { Mood } from "./MoodService";
import { Tag } from "./TagService";

export interface ChatCommand {
  _id: string;
  name: string;
  description?: string;
  enabled: boolean;
  uses: number;
  aliases: string[];
  messages: string[];
  privilege: number;
  useCount: number;
  tag: Tag;
  mood: Mood;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatCommandCreateData
  extends Omit<
    ChatCommand,
    "_id" | "createdAt" | "updatedAt" | "useCount" | "tag" | "mood" | "uses"
  > {
  tag: string;
  mood: string;
}

interface ChatCommandUpdateData extends Partial<ChatCommandCreateData> {}

export const useGetCommands = () => {
  return useAxiosCustom<PaginationData<ChatCommand>>({
    url: `/chat-commands`,
  });
};

export const useEditCommand = (
  commandId: string,
  data: ChatCommandUpdateData
) => {
  return useAxiosCustom<ChatCommandUpdateData>({
    url: `/chat-commands/${commandId}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const useCreateCommand = (data: ChatCommandCreateData) => {
  return useAxiosCustom<ChatCommandCreateData>({
    url: `/chat-commands/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useDeleteCommand = (commandId: string) => {
  return useAxiosCustom<any>({
    url: `/chat-commands/delete/${commandId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
