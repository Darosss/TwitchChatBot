import useAxiosCustom, {
  PaginationData,
  ResponseData,
  ResponseMessage,
} from "../api";
import { Overlay, OverlayCreateData, OverlaysUpdateData } from "./types";

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
  return useAxiosCustom<ResponseData<Overlay>, OverlayCreateData>({
    url: `/overlays/create`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useEditOverlayById = (id: string, data: OverlaysUpdateData) => {
  return useAxiosCustom<ResponseData<Overlay>, OverlaysUpdateData>({
    url: `/overlays/${id}`,
    method: "PATCH",
    bodyData: data,
    manual: true,
  });
};

export const useRemoveOverlayById = (id: string | null) => {
  return useAxiosCustom<ResponseMessage>({
    url: `/overlays/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
