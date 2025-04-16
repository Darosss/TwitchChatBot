import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  BaseEndpointNames,
  customAxios,
  onErrorHelperService,
  OnErrorHelperServiceAction,
  OnErrorHelperServiceConcern,
  PromiseBackendData,
  PromisePaginationData,
  refetchDataFunctionHelper,
} from "../api";
import {
  FetchBadgesParams,
  Badge,
  GetBagesImagesResponseData,
  BadgeUpdateData,
  BadgeCreateData,
} from "./types";

const baseEndpointName = `${BaseEndpointNames.ACHIEVEMENTS}/${BaseEndpointNames.BADGES}`;

export const queryKeysBadges = {
  allBadges: "badges",
  badgesImages: "badges-images",
  badgesImagesBasePath: "badges-images-base-path",
};

export const uploadBadgesData = {
  badgesImages: "achievements/badges/images/upload",
};

export const fetchBadges = async (
  params?: FetchBadgesParams
): PromisePaginationData<Badge> => {
  const response = await customAxios.get(`/${baseEndpointName}/`, { params });
  return response.data;
};

export const fetchBadgesImages =
  async (): PromiseBackendData<GetBagesImagesResponseData> => {
    const response = await customAxios.get(
      `/${baseEndpointName}/available-images`
    );
    return response.data;
  };

export const fetchBadgesImagesBasePath =
  async (): PromiseBackendData<string> => {
    const response = await customAxios.get(
      `/${baseEndpointName}/available-images/base-path`
    );
    return response.data;
  };

export const editBadge = async ({
  id,
  updatedBadge,
}: {
  id: string;
  updatedBadge: BadgeUpdateData;
}): PromiseBackendData<Badge> => {
  const response = await customAxios.patch(
    `/${baseEndpointName}/${id}`,
    updatedBadge
  );
  return response.data;
};
export const createBadge = async ({
  newBadge,
}: {
  newBadge: BadgeCreateData;
}): PromiseBackendData<Badge> => {
  const response = await customAxios.post(
    `/${baseEndpointName}/create`,
    newBadge
  );
  return response.data;
};
export const deleteBadge = async (id: string): PromiseBackendData<Badge> => {
  const response = await customAxios.delete(
    `/${baseEndpointName}/delete/${id}`
  );
  return response.data;
};
export const deleteBadgeImage = async (
  name: string
): PromiseBackendData<boolean> => {
  const response = await customAxios.delete(
    `${baseEndpointName}/images/${name}/delete`
  );
  return response.data;
};

export const useGetBadges = (params?: FetchBadgesParams) => {
  return useQuery([queryKeysBadges.allBadges, params], () =>
    fetchBadges(params)
  );
};

export const useGetBadgesImages = () => {
  return useQuery(queryKeysBadges.badgesImages, fetchBadgesImages);
};
export const useGetBadgesIamgesBasePath = () => {
  return useQuery(
    queryKeysBadges.badgesImagesBasePath,
    fetchBadgesImagesBasePath
  );
};

export const useEditBadge = () => {
  const refetchBadges = useRefetchBadgeData();
  return useMutation(editBadge, {
    onSuccess: refetchBadges,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.BADGE,
        OnErrorHelperServiceAction.EDIT
      );
    },
  });
};
export const useCreateBadge = () => {
  const refetchBadges = useRefetchBadgeData();
  return useMutation(createBadge, {
    onSuccess: refetchBadges,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.BADGE,
        OnErrorHelperServiceAction.CREATE
      );
    },
  });
};
export const useDeleteBadge = () => {
  const refetchBadges = useRefetchBadgeData();
  return useMutation(deleteBadge, {
    onSuccess: refetchBadges,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.BADGE,
        OnErrorHelperServiceAction.DELETE
      );
    },
  });
};
export const useDeleteBadgeImage = () => {
  const refetchBadges = useRefetchBadgeData();
  return useMutation(deleteBadgeImage, {
    onSuccess: refetchBadges,
    onError: (error) => {
      onErrorHelperService(
        error,
        OnErrorHelperServiceConcern.BADGE_IMAGE,
        OnErrorHelperServiceAction.DELETE
      );
    },
  });
};

export const useRefetchBadgeData = (exact = false) => {
  const queryClient = useQueryClient();
  return refetchDataFunctionHelper(
    queryKeysBadges,
    "allBadges",
    queryClient,
    null,
    exact
  );
};
