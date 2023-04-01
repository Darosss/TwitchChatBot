import { TagModel } from "@models/types";
import { RequestSearch } from "@types";

export const filterTagsByUrlParams = (params: RequestSearch<TagModel>) => {
  const { search_name } = params;
  const filterName = {
    ...(search_name && { name: { $regex: search_name, $options: "i" } }),
  };

  const searchFilter = {
    $and: [filterName],
  };
  return searchFilter;
};
