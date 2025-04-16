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
  FetchOverlaysParams,
  Overlay,
  OverlayCreateData,
  OverlaysUpdateData,
} from "./types";
import { socketConn } from "@socket";

export const fetchOverlaysDefaultParams: Required<FetchOverlaysParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "desc",
  sortBy: "createdAt",
};

const baseEndpointName = BaseEndpointNames.OVERLAYS;
export const queryKeysOverlays = {
  allOverlays: "overlays",
  overlayById: (id: string) => ["overlay", id] as [string, string],
};

export const fetchOverlays = async (
  params?: QueryParams<keyof FetchOverlaysParams>
): PromisePaginationData<Overlay> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const fetchOverlayById = async (
  id: string
): PromiseBackendData<Overlay> => {
  const response = await customAxios.get(`/${baseEndpointName}/${id}`);
  return response.data;
};

export const createOverlay = async (
  newOverlays: OverlayCreateData
): PromiseBackendData<Overlay> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newOverlays
  );
  return response.data;
};

export const editOverlay = async ({
  id,
  updatedOverlay,
}: {
  id: string;
  updatedOverlay: OverlaysUpdateData;
}): PromiseBackendData<Overlay> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedOverlay
  );
  return response.data;
};

export const duplicateOverlay = async (id: string) => {
  const response = await customAxios.post(
    `/${baseEndpointName}/duplicate/${id}`
  );
  return response.data;
};

export const deleteOverlay = async (
  id: string
): PromiseBackendData<Overlay> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetOverlays = (
  params?: QueryParams<keyof FetchOverlaysParams>
) => {
  return useQuery([queryKeysOverlays.allOverlays, params], () =>
    fetchOverlays(params)
  );
};

export const useEditOverlay = () => {
  const refetchOverlays = useRefetchOverlaysData();
  return useMutation(editOverlay, {
    onSuccess: (_, params) => {
      refetchOverlays().then(() => {
        socketConn.emit("refreshOverlayLayout", params.id);
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.OVERLAY,
        OnErrorHelperServiceAction.EDIT
      );
    },
  });
};

export const useDuplicateOverlay = (id: string) => {
  const refetchOverlays = useRefetchOverlaysData();
  return useMutation(() => duplicateOverlay(id), {
    onSuccess: refetchOverlays,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.OVERLAY,
        OnErrorHelperServiceAction.DUPLICATE
      );
    },
  });
};

export const useCreateOverlay = () => {
  const refetchOverlays = useRefetchOverlaysData();
  return useMutation(createOverlay, {
    onSuccess: refetchOverlays,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.OVERLAY,
        OnErrorHelperServiceAction.CREATE
      );
    },
  });
};

export const useDeleteOverlay = () => {
  const refetchOverlays = useRefetchOverlaysData();
  return useMutation(deleteOverlay, {
    onSuccess: refetchOverlays,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.OVERLAY,
        OnErrorHelperServiceAction.DELETE
      );
    },
  });
};

export const useGetOverlayById = (id: string) => {
  return useQuery(queryKeysOverlays.overlayById(id), () =>
    fetchOverlayById(id)
  );
};

export const useRefetchOverlaysData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysOverlays,
    "allOverlays",
    queryClient,
    null,
    exact
  );
};

export const useRefetchOverlayById = (exact = false) => {
  const queryClient = useQueryClient();
  return (id: string) =>
    refetchDataFunctionHelper(
      queryKeysOverlays,
      "overlayById",
      queryClient,
      [id],
      exact
    );
};
