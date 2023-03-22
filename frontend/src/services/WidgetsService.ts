import ReactGridLayout from "react-grid-layout";
import useAxiosCustom, { PaginationData, ResponseData } from "./ApiService";

export interface Widgets {
  _id: string;
  name: string;
  layout: ReactGridLayout.Layouts;
  toolbox: ReactGridLayout.Layouts;
  createdAt: Date;
  updatedAt: Date;
}

export interface WidgetsCreateData
  extends Pick<Widgets, "name" | "layout" | "toolbox"> {}

export interface WidgetsUpdateData extends Partial<WidgetsCreateData> {}

export const getWidgets = () => {
  return useAxiosCustom<PaginationData<Widgets>>({
    url: `/widgets`,
  });
};

export const getWidgetById = (id: string) => {
  return useAxiosCustom<ResponseData<Widgets>>({
    url: `/widgets/${id}`,
  });
};

export const createLayout = (data: WidgetsCreateData) => {
  return useAxiosCustom<Widgets>({
    url: `/widgets/create`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const editWidgetById = (id: string, data: WidgetsUpdateData) => {
  return useAxiosCustom<Widgets>({
    url: `/widgets/${id}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const removeWidgetById = (id: string) => {
  return useAxiosCustom<Widgets>({
    url: `/widgets/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
