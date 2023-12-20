import useAxiosCustom, { ResponseData, ResponseMessage } from "../api";
import { Config, ConfigUpdateData } from "./types";

export const useEditConfig = (data: ConfigUpdateData) => {
  return useAxiosCustom<ResponseMessage, ConfigUpdateData>({
    url: `/configs/edit`,
    method: "PATCH",
    bodyData: data,
    manual: true,
  });
};

export const useResetConfigs = () => {
  return useAxiosCustom<ResponseMessage>({
    url: `/configs/defaults`,
    method: "POST",
    manual: true,
  });
};
export const useGetConfigs = () => {
  return useAxiosCustom<ResponseData<Config>>({
    url: `/configs`,
  });
};
