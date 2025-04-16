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
  FetchMessageCategoriesParams,
  MessageCategory,
  MessageCategoryCreateData,
  MessageCategoryUpdateData,
} from "./types";

const baseEndpointName = BaseEndpointNames.MESSAGE_CATEGORIES;
export const queryKeysMessageCategories = {
  allMessageCategories: "message-categories",
};

export const fetchMessageCategoriesDefaultParams: Required<FetchMessageCategoriesParams> =
  {
    limit: 10,
    page: 1,
    search_name: "",
    sortOrder: "asc",
    sortBy: "createdAt",
    messages: "",
  };

export const fetchMessageCategories = async (
  params?: QueryParams<keyof FetchMessageCategoriesParams>
): PromisePaginationData<MessageCategory> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const createMessageCategory = async (
  newMessageCategory: MessageCategoryCreateData
): PromiseBackendData<MessageCategory> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newMessageCategory
  );
  return response.data;
};
export const incrementUsesMessageCategory = async (
  id: string
): PromiseBackendData<MessageCategory> => {
  const response = await customAxios.patch(`/${baseEndpointName}/${id}/uses`);
  return response.data;
};

export const editMessageCategory = async ({
  id,
  updatedMessageCategory,
}: {
  id: string;
  updatedMessageCategory: MessageCategoryUpdateData;
}): PromiseBackendData<MessageCategory> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedMessageCategory
  );
  return response.data;
};

export const deleteMessageCategory = async (
  id: string
): PromiseBackendData<MessageCategory> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetMessageCategories = (
  params?: QueryParams<keyof FetchMessageCategoriesParams>
) => {
  return useQuery(
    [queryKeysMessageCategories.allMessageCategories, params],
    () => fetchMessageCategories(params)
  );
};

export const useEditMessageCategory = () => {
  const refetchMessageCategories = useRefetchMessageCategoriesData();
  return useMutation(editMessageCategory, {
    onSuccess: refetchMessageCategories,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.MESSAGE_CATEGORY,
        OnErrorHelperServiceAction.EDIT
      );
    },
  });
};

export const useIncrementUsesCategoryById = () => {
  const refetchMessageCategories = useRefetchMessageCategoriesData();
  return useMutation(incrementUsesMessageCategory, {
    onSuccess: refetchMessageCategories,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.MESSAGE_CATEGORY,
        OnErrorHelperServiceAction.INCREMENT_USES
      );
    },
  });
};

export const useCreateMessageCategory = () => {
  const refetchMessageCategories = useRefetchMessageCategoriesData();
  return useMutation(createMessageCategory, {
    onSuccess: refetchMessageCategories,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.MESSAGE_CATEGORY,
        OnErrorHelperServiceAction.CREATE
      );
    },
  });
};

export const useDeleteMessageCategory = () => {
  const refetchMessageCategories = useRefetchMessageCategoriesData();
  return useMutation(deleteMessageCategory, {
    onSuccess: refetchMessageCategories,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.MESSAGE_CATEGORY,
        OnErrorHelperServiceAction.DELETE
      );
    },
  });
};

export const useRefetchMessageCategoriesData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysMessageCategories,
    "allMessageCategories",
    queryClient,
    null,
    exact
  );
};
