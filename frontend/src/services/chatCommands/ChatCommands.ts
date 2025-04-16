import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  BaseEndpointNames,
  QueryParams,
  PromisePaginationData,
  customAxios,
  PromiseBackendData,
  onErrorHelperService,
  OnErrorHelperServiceAction,
  OnErrorHelperServiceConcern,
  refetchDataFunctionHelper,
} from "../api";
import {
  FetchChatCommandParams,
  ChatCommand,
  ChatCommandCreateData,
  ChatCommandUpdateData,
} from "./types";
import { socketConn } from "@socket";

const baseEndpointName = BaseEndpointNames.CHAT_COMMANDS;

export const queryKeysChatCommands = {
  allChatCommands: "chat-commands",
};

export const fetchChatCommandsDefaultParams: Required<FetchChatCommandParams> =
  {
    limit: 10,
    page: 1,
    search_name: "",
    sortOrder: "asc",
    sortBy: "createdAt",
    end_date: "",
    start_date: "",
    privilege: "",
    aliases: "",
    description: "",
    messages: "",
  };

export const fetchChatCommands = async (
  params?: QueryParams<keyof FetchChatCommandParams>
): PromisePaginationData<ChatCommand> => {
  const response = await customAxios.get(`/${baseEndpointName}`, {
    params,
  });
  return response.data;
};

export const createChatCommand = async (
  newChatCommand: ChatCommandCreateData
): PromiseBackendData<ChatCommand> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newChatCommand
  );
  return response.data;
};

export const editChatCommand = async ({
  id,
  updatedChatCommand,
}: {
  id: string;
  updatedChatCommand: ChatCommandUpdateData;
}): PromiseBackendData<ChatCommand> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedChatCommand
  );
  return response.data;
};

export const deleteChatCommand = async (
  id: string
): PromiseBackendData<ChatCommand> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetChatCommands = (
  params?: QueryParams<keyof FetchChatCommandParams>
) => {
  return useQuery([queryKeysChatCommands.allChatCommands, params], () =>
    fetchChatCommands(params)
  );
};

export const useEditChatCommand = () => {
  const refetchChatCommands = useRefetchChatCommandsData();
  return useMutation(editChatCommand, {
    onSuccess: () => {
      refetchChatCommands().then(() => {
        socketConn.emit("refreshCommands");
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.COMMAND,
        OnErrorHelperServiceAction.EDIT
      );
    },
  });
};

export const useCreateChatCommand = () => {
  const refetchChatCommands = useRefetchChatCommandsData();
  return useMutation(createChatCommand, {
    onSuccess: () => {
      refetchChatCommands().then(() => {
        socketConn.emit("refreshCommands");
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.COMMAND,
        OnErrorHelperServiceAction.CREATE
      );
    },
  });
};

export const useDeleteChatCommand = () => {
  const refetchChatCommands = useRefetchChatCommandsData();
  return useMutation(deleteChatCommand, {
    onSuccess: () => {
      refetchChatCommands().then(() => {
        socketConn.emit("refreshCommands");
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.COMMAND,
        OnErrorHelperServiceAction.DELETE
      );
    },
  });
};

export const useRefetchChatCommandsData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysChatCommands,
    "allChatCommands",
    queryClient,
    null,
    exact
  );
};
