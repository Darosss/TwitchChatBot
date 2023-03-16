import ReactGridLayout from "react-grid-layout";
import useAxiosCustom, { IPagination, IResponseData } from "./ApiService";

export interface IWidgets {
  _id: string;
  name: string;
  layout: ReactGridLayout.Layouts;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWidgetsCreateData extends Pick<IWidgets, "name" | "layout"> {}

export interface IWidgetsUpdateData extends Partial<IWidgetsCreateData> {}

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
    url: `/widgets/remove/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
