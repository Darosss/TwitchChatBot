import ReactGridLayout from "react-grid-layout";
import useAxiosCustom, { PaginationData, ResponseData } from "./ApiService";

interface OverlayStylesType {
  overlayRedemptions: string;
  overlayMusicPlayer: string;
  overlayYoutubeMusicPlayer: string;
  overlayAchievements: string;
  overlayChat: string;
}
export interface Overlay {
  _id: string;
  name: string;
  layout: ReactGridLayout.Layouts;
  toolbox: ReactGridLayout.Layouts;
  styles?: OverlayStylesType;
  createdAt: Date;
  updatedAt: Date;
}

export interface OverlayCreateData
  extends Pick<Overlay, "name" | "layout" | "toolbox"> {}

export interface OverlaysUpdateData
  extends Partial<OverlayCreateData>,
    Pick<Overlay, "styles"> {}

export const useGetOverlays = () => {
  return useAxiosCustom<PaginationData<Overlay>>({
    url: `/overlays`,
  });
};

export const useGetOverlayById = (id: string) => {
  return useAxiosCustom<ResponseData<Overlay>>({
    url: `/overlays/${id}`,
  });
};

export const useCreateOverlay = (data: OverlayCreateData) => {
  return useAxiosCustom<Overlay>({
    url: `/overlays/create`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useEditOverlayById = (id: string, data: OverlaysUpdateData) => {
  return useAxiosCustom<Overlay>({
    url: `/overlays/${id}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const useRemoveOverlayById = (id: string) => {
  return useAxiosCustom<Overlay>({
    url: `/overlays/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
