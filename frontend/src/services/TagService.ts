import useAxiosCustom, { PaginationData } from "./ApiService";

export interface Tag {
  _id: string;
  name: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TagCreateData extends Pick<Tag, "name"> {}

interface TagUpdateData extends Partial<TagCreateData> {
  enabled?: boolean;
}

export const getTags = (urlParams = true) => {
  return useAxiosCustom<PaginationData<Tag>>({
    url: `/tags`,
    urlParams: urlParams,
  });
};

export const editTag = (id: string, data: TagUpdateData) => {
  return useAxiosCustom<Tag>({
    url: `/tags/${id}`,
    method: "POST",
    bodyData: data,
    manual: true,
  });
};

export const createTag = (data: TagCreateData) => {
  return useAxiosCustom<Tag>({
    url: `/tags/create/`,
    method: "POST",
    bodyData: data,
    manual: true,
    urlParams: false,
  });
};

export const deleteTag = (id: string) => {
  return useAxiosCustom<Tag>({
    url: `/tags/delete/${id}`,
    method: "DELETE",
    manual: true,
    urlParams: false,
  });
};
