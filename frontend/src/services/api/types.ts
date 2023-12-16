export interface ResponseMessage {
  message: string;
}

export interface ResponseData<T> extends Partial<ResponseMessage> {
  data: T;
}

export interface PaginationData<T> {
  data: T[];
  totalPages: number;
  count: number;
  currentPage: number;
}

export interface AxiosCustomOptions<TBody> {
  url: string | URL;
  method?: string;
  bodyData?: Partial<TBody>;
  manual?: boolean;
  urlParams?: boolean;
}

export type AxiosCustomReturnErrorType = {
  message: string;
  status: number;
  code?: string;
} | null;

export interface AxiosCustomReturn<TResponse = unknown> {
  data: TResponse | undefined;
  loading: boolean;
  error: AxiosCustomReturnErrorType;
  refetchData: () => Promise<TResponse>;
}

export interface BaseModelProperties {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface BackendError {
  message: string;
  status: number;
}

export interface SearchParams {
  limit?: number;
  page?: number;
}

export interface CommonDeleteHookParams {
  id: string;
}
