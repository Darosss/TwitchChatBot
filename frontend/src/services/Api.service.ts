import useAxios, { configure } from "axios-hooks";
import Axios, { AxiosRequestConfig } from "axios";
import { useSearchParams } from "react-router-dom";
import IMessage from "./Message.service";
import IRedemption from "./Redemption.service";
import IChatCommand from "./Chat-command.service";

export interface IPagination<T> {
  data: T[];
  totalPages: number;
  count: number;
  currentPage: number;
}

interface AxiosCustomOptions<T> {
  url: string | URL;
  method?: string;
  bodyData?: Partial<T>;
  manual?: boolean;
  urlParams?: boolean;
}

const axios = Axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

configure({ axios });

const useAxiosCustom = <T>(options: AxiosCustomOptions<T>) => {
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
