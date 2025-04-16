import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  BaseEndpointNames,
  customAxios,
  onErrorHelperService,
  OnErrorHelperServiceAction,
  OnErrorHelperServiceConcern,
  PromiseBackendData,
  PromisePaginationData,
  QueryParams,
  refetchDataFunctionHelper,
} from "../api";
import {
  FetchTimerParams,
  Timer,
  TimerCreateData,
  TimerUpdateData,
} from "./types";
import { socketConn } from "@socket";

export const fetchTimersDefaultParams: Required<FetchTimerParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "desc",
  sortBy: "createdAt",
  messages: "",
};

const baseEndpointName = BaseEndpointNames.TIMERS;
export const queryKeysTimers = {
  allTimers: "timers",
};

export const fetchTimers = async (
  params?: QueryParams<keyof FetchTimerParams>
): PromisePaginationData<Timer> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const createTimer = async (
  newTimer: TimerCreateData
): PromiseBackendData<Timer> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newTimer
  );
  return response.data;
};

export const editTimer = async ({
  id,
  updatedTimer,
}: {
  id: string;
  updatedTimer: TimerUpdateData;
}): PromiseBackendData<Timer> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedTimer
  );
  return response.data;
};

export const deleteTimer = async (id: string): PromiseBackendData<Timer> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetTimers = (params?: QueryParams<keyof FetchTimerParams>) => {
  return useQuery([queryKeysTimers.allTimers, params], () =>
    fetchTimers(params)
  );
};

export const useEditTimer = () => {
  const refetchTimers = useRefetchTimersData();
  return useMutation(editTimer, {
    onSuccess: () =>
      refetchTimers().then(() => {
        socketConn.emit("refreshTimers");
      }),
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.TIMER,
        OnErrorHelperServiceAction.EDIT
      );
    },
  });
};

export const useCreateTimer = () => {
  const refetchTimers = useRefetchTimersData();
  return useMutation(createTimer, {
    onSuccess: () =>
      refetchTimers().then(() => {
        socketConn.emit("refreshTimers");
      }),
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.TIMER,
        OnErrorHelperServiceAction.CREATE
      );
    },
  });
};

export const useDeleteTimer = () => {
  const refetchTimers = useRefetchTimersData();
  return useMutation(deleteTimer, {
    onSuccess: () => {
      refetchTimers().then(() => {
        socketConn.emit("refreshTimers");
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.TIMER,
        OnErrorHelperServiceAction.DELETE
      );
    },
  });
};
export const useRefetchTimersData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysTimers,
    "allTimers",
    queryClient,
    null,
    exact
  );
};
