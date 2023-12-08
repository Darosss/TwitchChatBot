import useAxiosCustom from "../api";
import { Config, ConfigUpdateData } from "./types";

export const useEditConfig = (data: ConfigUpdateData) => {
  return useAxiosCustom<Config>({
    url: `/configs/edit`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const useResetConfigs = () => {
  return useAxiosCustom<Config>({
    url: `/configs/defaults`,
    method: "POST",
    manual: true,
  });
};
export const useGetConfigs = () => {
  return useAxiosCustom<Config>({
    url: `/configs`,
  });
};
