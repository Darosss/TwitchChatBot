import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  BackendData,
  BaseEndpointNames,
  customAxios,
  onErrorHelperService,
  OnErrorHelperServiceAction,
  OnErrorHelperServiceConcern,
  PromiseBackendData,
  refetchDataFunctionHelper,
} from "../api";
import { socketConn } from "@socket";
import { Config, ConfigUpdateData } from "./types";

const baseEndpointName = BaseEndpointNames.CONFIGS;

export const queryKeysConfigs = {
  allConfigs: "configs",
};

export const fetchConfigs = async (): Promise<BackendData<Config>> => {
  const response = await customAxios.get(`/${baseEndpointName}`);
  return response.data;
};

export const editConfig = async ({
  updatedConfig,
}: {
  updatedConfig: ConfigUpdateData;
}): PromiseBackendData<Config> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/edit`,
    updatedConfig
  );
  return response.data;
};

export const resetConfigs = async (): PromiseBackendData<Config> => {
  const response = await customAxios.patch(`/${baseEndpointName}/defaults`);
  return response.data;
};

export const useGetConfigs = () => {
  return useQuery(queryKeysConfigs.allConfigs, () => fetchConfigs());
};

export const useEditConfig = () => {
  const refetchConfigs = useRefetchConfigsData();
  return useMutation(editConfig, {
    onSuccess: () => {
      refetchConfigs().then(() => {
        socketConn.emit("saveConfigs");
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.CONFIG,
        OnErrorHelperServiceAction.EDIT
      );
    },
  });
};

export const useResetConfigs = () => {
  const refetchConfigs = useRefetchConfigsData();
  return useMutation(resetConfigs, {
    onSuccess: () => {
      refetchConfigs().then(() => {
        socketConn.emit("saveConfigs");
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.CONFIG,
        OnErrorHelperServiceAction.EDIT
      );
    },
  });
};

export const useRefetchConfigsData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysConfigs,
    "allConfigs",
    queryClient,
    null,
    exact
  );
};
