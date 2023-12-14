import useAxios, { configure } from "axios-hooks";
import Axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useSearchParams } from "react-router-dom";
import { viteBackendUrl } from "src/configs/envVariables";
import { AxiosCustomOptions, AxiosCustomReturn, BackendError } from "./types";
import { addErrorNotification } from "@utils";

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
  const [{ data, loading, error }, refetch] = useAxios<T, any, BackendError>(
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
    } catch (err) {
      if (err instanceof AxiosError) {
        addErrorNotification(err.response?.data.message);
      } else if (err instanceof Error) {
        addErrorNotification(err.message);
      } else {
        addErrorNotification("An unknow error appeared. ");
      }
      throw err;
    }
  };

  return {
    data,
    loading,
    error: !error
      ? null
      : {
          code: error.code,
          message: error.response?.data.message || error.message,
          status: error.response?.data.status || error.status || 500,
        },
    refetchData,
  };
};

export default useAxiosCustom;
