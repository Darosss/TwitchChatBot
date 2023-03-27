import useAxiosCustom, { PaginationData } from "./ApiService";

export interface Tag {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TagCreateData extends Pick<Tag, "name"> {}

interface TagUpdateData extends Partial<TagCreateData> {}

export const getTags = () => {
  return useAxiosCustom<PaginationData<Tag>>({
    url: `/tags`,
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
