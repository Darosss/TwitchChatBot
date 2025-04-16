import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  BaseEndpointNames,
  QueryParams,
  PromisePaginationData,
  customAxios,
  PromiseBackendData,
  onErrorHelperService,
  OnErrorHelperServiceAction,
  OnErrorHelperServiceConcern,
  refetchDataFunctionHelper,
} from "../api";
import {
  FetchAffixParams,
  Affix,
  AffixCreateData,
  AffixUpdateData,
} from "./types";
import { socketConn } from "@socket";

export const fetchAffixesDefaultParams: Required<FetchAffixParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "asc",
  sortBy: "createdAt",
};

const baseEndpointName = BaseEndpointNames.AFFIXES;
export const queryKeysAffixes = {
  allAffixes: "affixes",
};

export const fetchAffixes = async (
  params?: QueryParams<keyof FetchAffixParams>
): PromisePaginationData<Affix> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const createAffix = async (
  newAffix: AffixCreateData
): PromiseBackendData<Affix> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newAffix
  );
  return response.data;
};

export const editAffix = async ({
  id,
  updatedAffix,
}: {
  id: string;
  updatedAffix: AffixUpdateData;
}): PromiseBackendData<Affix> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedAffix
  );
  return response.data;
};

export const deleteAffix = async (id: string): PromiseBackendData<Affix> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetAffixes = (params?: QueryParams<keyof FetchAffixParams>) => {
  return useQuery([queryKeysAffixes.allAffixes, params], () =>
    fetchAffixes(params)
  );
};

export const useEditAffix = () => {
  const refetchAffixes = useRefetchAffixesData();
  return useMutation(editAffix, {
    onSuccess: () => {
      refetchAffixes().then(() => {
        socketConn.emit("changeModes");
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.AFFIX,
        OnErrorHelperServiceAction.EDIT
      );
    },
  });
};

export const useCreateAffix = () => {
  const refetchAffixes = useRefetchAffixesData();
  return useMutation(createAffix, {
    onSuccess: () => {
      refetchAffixes().then(() => {
        socketConn.emit("changeModes");
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.AFFIX,
        OnErrorHelperServiceAction.CREATE
      );
    },
  });
};

export const useDeleteAffix = () => {
  const refetchAffixes = useRefetchAffixesData();
  return useMutation(deleteAffix, {
    onSuccess: () => {
      refetchAffixes().then(() => {
        socketConn.emit("changeModes");
      });
    },
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.AFFIX,
        OnErrorHelperServiceAction.DELETE
      );
    },
  });
};
export const useRefetchAffixesData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysAffixes,
    "allAffixes",
    queryClient,
    null,
    exact
  );
};
