import useAxiosCustom, { PaginationData } from "./ApiService";

export interface Personality {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PersonalityCreateData extends Pick<Personality, "name"> {}

interface PersonalityUpdateData extends Partial<PersonalityCreateData> {}

export const getPersonalities = () => {
  return useAxiosCustom<PaginationData<Personality>>({
    url: `/personalities`,
  });
};

export const editPersonality = (id: string, data: PersonalityUpdateData) => {
  return useAxiosCustom<Personality>({
    url: `/personalities/${id}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const createPersonality = (data: PersonalityCreateData) => {
  return useAxiosCustom<Personality>({
    url: `/personalities/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const deletePersonality = (id: string) => {
  return useAxiosCustom<Personality>({
    url: `/personalities/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
