import useAxiosCustom, {
  PaginationData,
  ResponseData,
  ResponseMessage,
} from "../api";
import { Affix, AffixUpdateData, AffixCreateData } from "./types";

export const useGetAffixes = (urlParams = true) => {
  return useAxiosCustom<PaginationData<Affix>>({
    url: `/affixes`,
    urlParams: urlParams,
  });
};

export const useEditAffix = (id: string, data: AffixUpdateData) => {
  return useAxiosCustom<ResponseData<Affix>, AffixUpdateData>({
    url: `/affixes/${id}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const useCreateAffix = (data: AffixCreateData) => {
  return useAxiosCustom<ResponseData<Affix>, AffixCreateData>({
    url: `/affixes/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useDeleteAffix = (id: string | null) => {
  return useAxiosCustom<ResponseMessage>({
    url: `/affixes/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
