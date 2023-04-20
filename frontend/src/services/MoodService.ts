import useAxiosCustom, { PaginationData } from "./ApiService";

export interface Mood {
  _id: string;
  name: string;
  enabled: boolean;
  prefixes: string[];
  sufixes: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface MoodCreateData extends Pick<Mood, "name" | "prefixes" | "sufixes"> {}

interface MoodUpdateData extends Partial<MoodCreateData> {
  enabled?: boolean;
}

export const getMoods = (urlParams = true) => {
  return useAxiosCustom<PaginationData<Mood>>({
    url: `/moods`,
    urlParams: urlParams,
  });
};

export const editMood = (id: string, data: MoodUpdateData) => {
  return useAxiosCustom<Mood>({
    url: `/moods/${id}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const createMood = (data: MoodCreateData) => {
  return useAxiosCustom<Mood>({
    url: `/moods/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const deleteMood = (id: string) => {
  return useAxiosCustom<Mood>({
    url: `/moods/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
