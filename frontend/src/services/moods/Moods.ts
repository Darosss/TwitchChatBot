import useAxiosCustom, { PaginationData } from "../api";
import { Mood, MoodUpdateData, MoodCreateData } from "./types";

export const useGetMoods = (urlParams = true) => {
  return useAxiosCustom<PaginationData<Mood>>({
    url: `/moods`,
    urlParams: urlParams,
  });
};

export const useEditMood = (id: string, data: MoodUpdateData) => {
  return useAxiosCustom<Mood>({
    url: `/moods/${id}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const useCreateMood = (data: MoodCreateData) => {
  return useAxiosCustom<Mood>({
    url: `/moods/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const useDeleteMood = (id: string) => {
  return useAxiosCustom<Mood>({
    url: `/moods/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
