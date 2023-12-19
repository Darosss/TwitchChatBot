import { Widgets, WidgetsCreateData, WidgetsUpdateData } from "./types";
import useAxiosCustom, {
  PaginationData,
  ResponseData,
  ResponseMessage,
} from "../api";

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
  return useAxiosCustom<ResponseData<Widgets>, WidgetsCreateData>({
    url: `/widgets/create`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useEditWidgetById = (id: string, data: WidgetsUpdateData) => {
  return useAxiosCustom<ResponseData<Widgets>, WidgetsUpdateData>({
    url: `/widgets/${id}`,
    method: "PATCH",
    bodyData: data,
    manual: true,
  });
};

export const useRemoveWidgetById = (widgetId: string | null) => {
  return useAxiosCustom<ResponseMessage>({
    url: `/widgets/delete/${widgetId}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
