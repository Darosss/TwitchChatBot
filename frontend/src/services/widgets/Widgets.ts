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
  FetchWidgetsParams,
  Widget,
  WidgetCreateData,
  WidgetUpdateData,
} from "./types";

const baseEndpointName = BaseEndpointNames.WIDGETS;
export const queryKeysWidgets = {
  allWidgets: "widgets",
  widgetById: (id: string) => ["widgets", id] as [string, string],
};

export const fetchWidgetsDefaultParams: Required<FetchWidgetsParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "desc",
  sortBy: "createdAt",
};

export const fetchWidgets = async (
  params?: QueryParams<keyof FetchWidgetsParams>
): PromisePaginationData<Widget> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const fetchWidgetById = async (
  id: string
): PromiseBackendData<Widget> => {
  const response = await customAxios.get(`/${baseEndpointName}/${id}`);
  return response.data;
};

export const createWidget = async (
  newWidgets: WidgetCreateData
): PromiseBackendData<Widget> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newWidgets
  );
  return response.data;
};

export const editWidget = async ({
  id,
  updatedWidget,
}: {
  id: string;
  updatedWidget: WidgetUpdateData;
}): PromiseBackendData<Widget> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedWidget
  );
  return response.data;
};

export const deleteWidget = async (id: string): PromiseBackendData<Widget> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetWidgets = (
  params?: QueryParams<keyof FetchWidgetsParams>
) => {
  return useQuery([queryKeysWidgets.allWidgets, params], () =>
    fetchWidgets(params)
  );
};

export const useEditWidget = () => {
  const refetchWidgets = useRefetchWidgetsData();
  return useMutation(editWidget, {
    onSuccess: refetchWidgets,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.WIDGET,
        OnErrorHelperServiceAction.EDIT
      );
    },
  });
};

export const useCreateWidget = () => {
  const refetchWidgets = useRefetchWidgetsData();
  return useMutation(createWidget, {
    onSuccess: refetchWidgets,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.WIDGET,
        OnErrorHelperServiceAction.CREATE
      );
    },
  });
};

export const useDeleteWidget = () => {
  const refetchWidgets = useRefetchWidgetsData();
  return useMutation(deleteWidget, {
    onSuccess: refetchWidgets,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.WIDGET,
        OnErrorHelperServiceAction.DELETE
      );
    },
  });
};

export const useGetWidgetById = (id: string) => {
  return useQuery(queryKeysWidgets.widgetById(id), () => fetchWidgetById(id));
};

export const useRefetchWidgetsData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysWidgets,
    "allWidgets",
    queryClient,
    null,
    exact
  );
};
