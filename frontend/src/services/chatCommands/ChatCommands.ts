import useAxiosCustom, { PaginationData } from "../api";
import {
  ChatCommandUpdateData,
  ChatCommandCreateData,
  ChatCommand,
} from "./types";

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

export const useDeleteCommand = (commandId: string | null) => {
  return useAxiosCustom<any>({
    url: `/chat-commands/delete/${commandId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
