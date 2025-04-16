import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  BaseEndpointNames,
  customAxios,
  onErrorHelperService,
  OnErrorHelperServiceAction,
  OnErrorHelperServiceConcern,
  PromiseBackendData,
  PromisePaginationData,
  QueryParams,
  refetchDataFunctionHelper,
} from "../api";
import { FetchTagParams, Tag, TagCreateData, TagUpdateData } from "./types";
import { socketConn } from "@socket";

export const fetchTagsDefaultParams: Required<FetchTagParams> = {
  limit: 10,
  page: 1,
  search_name: "",
  sortOrder: "asc",
  sortBy: "createdAt",
};

const baseEndpointName = BaseEndpointNames.TAGS;
export const queryKeysTags = {
  allTags: "tags",
};

export const fetchTags = async (
  params?: QueryParams<keyof FetchTagParams>
): PromisePaginationData<Tag> => {
  const response = await customAxios.get(`/${baseEndpointName}`, { params });
  return response.data;
};

export const createTag = async (
  newTag: TagCreateData
): PromiseBackendData<Tag> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newTag
  );
  return response.data;
};

export const editTag = async ({
  id,
  updatedTag,
}: {
  id: string;
  updatedTag: TagUpdateData;
}): PromiseBackendData<Tag> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedTag
  );
  return response.data;
};

export const deleteTag = async (id: string): PromiseBackendData<Tag> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};

export const useGetTags = (params?: QueryParams<keyof FetchTagParams>) => {
  return useQuery([queryKeysTags.allTags, params], () => fetchTags(params));
};

export const useEditTag = () => {
  const refetchTags = useRefetchTagsData();
  return useMutation(editTag, {
    onSuccess: () =>
      refetchTags().then(() => {
        socketConn.emit("changeModes");
      }),
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.TAG,
        OnErrorHelperServiceAction.EDIT
      );
    },
  });
};

export const useCreateTag = () => {
  const refetchTags = useRefetchTagsData();
  return useMutation(createTag, {
    onSuccess: () =>
      refetchTags().then(() => {
        socketConn.emit("changeModes");
      }),
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.TAG,
        OnErrorHelperServiceAction.CREATE
      );
    },
  });
};

export const useDeleteTag = () => {
  const refetchTags = useRefetchTagsData();
  return useMutation(deleteTag, {
    onSuccess: () =>
      refetchTags().then(() => {
        socketConn.emit("changeModes");
      }),
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.TAG,
        OnErrorHelperServiceAction.DELETE
      );
    },
  });
};

export const useRefetchTagsData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysTags,
    "allTags",
    queryClient,
    null,
    exact
  );
};
