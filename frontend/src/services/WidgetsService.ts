import ReactGridLayout from "react-grid-layout";
import useAxiosCustom, { IPagination, IResponseData } from "./ApiService";

export interface IWidgets {
  _id: string;
  name: string;
  layout: ReactGridLayout.Layouts;
  toolbox: ReactGridLayout.Layouts;
  createdAt: Date;
  updatedAt: Date;
}

export type IWidgetsCreateData = Pick<IWidgets, "name" | "layout" | "toolbox">;

export type IWidgetsUpdateData = Partial<IWidgetsCreateData>;

export const getWidgets = () => {
  return useAxiosCustom<IPagination<IWidgets>>({
    url: `/widgets`,
  });
};

export const getWidgetById = (id: string) => {
  return useAxiosCustom<IResponseData<IWidgets>>({
    url: `/widgets/${id}`,
  });
};

export const createLayout = (data: IWidgetsCreateData) => {
  return useAxiosCustom<IWidgets>({
    url: `/widgets/create`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const editWidgetById = (id: string, data: IWidgetsUpdateData) => {
  return useAxiosCustom<IWidgets>({
    url: `/widgets/${id}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const removeWidgetById = (id: string) => {
  return useAxiosCustom<IWidgets>({
    url: `/widgets/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};