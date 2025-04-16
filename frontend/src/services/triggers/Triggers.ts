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
  FetchTriggerParams,
  Trigger,
  TriggerCreateData,
  TriggerUpdateData,
} from "./types";
import { socketConn } from "@socket";

export const fetchTriggersDefaultParams: Required<FetchTriggerParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "desc",
  sortBy: "createdAt",
  words: "",
  messages: "",
  start_date: "",
  end_date: "",
};

const baseEndpointName = BaseEndpointNames.TRIGGERS;
export const queryKeysTriggers = {
  allTriggers: "triggers",
};

export const fetchTriggers = async (
  params?: QueryParams<keyof FetchTriggerParams>
): PromisePaginationData<Trigger> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const createTrigger = async (
  newTrigger: TriggerCreateData
): PromiseBackendData<Trigger> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newTrigger
  );
  return response.data;
};

export const editTrigger = async ({
  id,
  updatedTrigger,
}: {
  id: string;
  updatedTrigger: TriggerUpdateData;
}): PromiseBackendData<Trigger> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedTrigger
  );
  return response.data;
};

export const deleteTrigger = async (
  id: string
): PromiseBackendData<Trigger> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetTriggers = (
  params?: QueryParams<keyof FetchTriggerParams>
) => {
  return useQuery([queryKeysTriggers.allTriggers, params], () =>
    fetchTriggers(params)
  );
};

export const useEditTrigger = () => {
  const refetchTriggers = useRefetchTriggersData();
  return useMutation(editTrigger, {
    onSuccess: () => {
      refetchTriggers().then(() => {
        socketConn.emit("refreshTriggers");
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.TRIGGER,
        OnErrorHelperServiceAction.EDIT
      );
    },
  });
};

export const useCreateTrigger = () => {
  const refetchTriggers = useRefetchTriggersData();
  return useMutation(createTrigger, {
    onSuccess: () => {
      refetchTriggers().then(() => {
        socketConn.emit("refreshTriggers");
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.TRIGGER,
        OnErrorHelperServiceAction.CREATE
      );
    },
  });
};

export const useDeleteTrigger = () => {
  const refetchTriggers = useRefetchTriggersData();
  return useMutation(deleteTrigger, {
    onSuccess: () => {
      refetchTriggers().then(() => {
        socketConn.emit("refreshTriggers");
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.TRIGGER,
        OnErrorHelperServiceAction.DELETE
      );
    },
  });
};

export const useRefetchTriggersData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysTriggers,
    "allTriggers",
    queryClient,
    null,
    exact
  );
};
