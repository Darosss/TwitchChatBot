import { Widgets, WidgetsCreateData, WidgetsUpdateData } from "./types";
import useAxiosCustom, { PaginationData, ResponseData } from "../api";

export const useGetWidgets = () => {
  return useAxiosCustom<PaginationData<Widgets>>({
    url: `/widgets`,
  });
};

export const useGetWidgetById = (id: string) => {
  return useAxiosCustom<ResponseData<Widgets>>({
    url: `/widgets/${id}`,
  });
};

export const useCreateLayout = (data: WidgetsCreateData) => {
  return useAxiosCustom<Widgets>({
    url: `/widgets/create`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useEditWidgetById = (id: string, data: WidgetsUpdateData) => {
  return useAxiosCustom<Widgets>({
    url: `/widgets/${id}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const useRemoveWidgetById = (widgetId: string | null) => {
  return useAxiosCustom<Widgets>({
    url: `/widgets/delete/${widgetId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
