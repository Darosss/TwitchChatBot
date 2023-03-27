import useAxiosCustom, { PaginationData } from "./ApiService";

export interface Mood {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MoodCreateData extends Pick<Mood, "name"> {}

interface MoodUpdateData extends Partial<MoodCreateData> {}

export const getMoods = () => {
  return useAxiosCustom<PaginationData<Mood>>({
    url: `/moods`,
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
