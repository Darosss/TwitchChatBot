import { AxiosError } from "axios";

export interface ResponseData<T> {
  data: T;
}

export interface PaginationData<T> {
  data: T[];
  totalPages: number;
  count: number;
  currentPage: number;
}

export interface AxiosCustomOptions<T> {
  url: string | URL;
  method?: string;
  bodyData?: Partial<T>;
  manual?: boolean;
  urlParams?: boolean;
}

export interface AxiosCustomReturn<T> {
  data: T | undefined;
  loading: boolean;
  error: AxiosError<any, any> | null;
  refetchData: () => Promise<T>;
}

export interface BaseModelProperties {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchParams {
  limit?: number;
  page?: number;
}
