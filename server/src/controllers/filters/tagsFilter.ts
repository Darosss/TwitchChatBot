import { RequestSearch } from "@types";

export const filterTagsByUrlParams = (params: RequestSearch) => {
  const { search_name } = params;
  const filterName = {
    ...(search_name && { name: { $regex: search_name, $options: "i" } }),
  };

  const searchFilter = {
    $and: [filterName],
  };
  return searchFilter;
};
