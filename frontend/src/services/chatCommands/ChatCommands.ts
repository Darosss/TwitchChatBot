import useAxiosCustom, {
  PaginationData,
  ResponseData,
  ResponseMessage,
} from "../api";
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
  return useAxiosCustom<ResponseData<ChatCommand>, ChatCommandUpdateData>({
    url: `/chat-commands/${commandId}`,
    method: "PATCH",
    bodyData: data,
    manual: true,
  });
};

export const useCreateCommand = (data: ChatCommandCreateData) => {
  return useAxiosCustom<ResponseData<ChatCommand>, ChatCommandCreateData>({
    url: `/chat-commands/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useDeleteCommand = (commandId: string | null) => {
  return useAxiosCustom<ResponseMessage>({
    url: `/chat-commands/delete/${commandId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
