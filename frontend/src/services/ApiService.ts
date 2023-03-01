import useAxios, { configure } from "axios-hooks";
import Axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useSearchParams } from "react-router-dom";

export interface IResponseData<T> {
  data: T;
}

export interface IPagination<T> {
  data: T[];
  totalPages: number;
  count: number;
  currentPage: number;
}

interface IAxiosCustomOptions<T> {
  url: string | URL;
  method?: string;
  bodyData?: Partial<T>;
  manual?: boolean;
  urlParams?: boolean;
}

export interface IAxiosCustomReturn<T> {
  data: T | undefined;
  loading: boolean;
  error: AxiosError<any, any> | null;
  refetchData: () => Promise<T>;
}

const axios = Axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

configure({ axios });

const useAxiosCustom = <T>(
  options: IAxiosCustomOptions<T>
): IAxiosCustomReturn<T> => {
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
