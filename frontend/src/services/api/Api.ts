import useAxios, { configure } from "axios-hooks";
import Axios, { AxiosRequestConfig } from "axios";
import { useSearchParams } from "react-router-dom";
import { viteBackendUrl } from "src/configs/envVariables";
import { AxiosCustomOptions, AxiosCustomReturn } from "./types";

const axios = Axios.create({
  baseURL: viteBackendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

configure({ axios });

const useAxiosCustom = <T>(
  options: AxiosCustomOptions<T>
): AxiosCustomReturn<T> => {
  const {
    method = "GET",
    url,
    bodyData,
    manual = false,
    urlParams = true,
  } = options;

  const [searchParams] = useSearchParams();
  const [{ data, loading, error }, refetch] = useAxios<T>(
    {
      url: url + (urlParams ? "?" + searchParams : ""),
      method: method,
    } as AxiosRequestConfig,
    { autoCancel: false, manual: manual }
  );
  const refetchData = async () => {
    try {
      const response = await refetch({
        ...(bodyData && { data: bodyData }),
      } as AxiosRequestConfig);

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  return {
    data,
    loading,
    error,
    refetchData,
  };
};

export default useAxiosCustom;
