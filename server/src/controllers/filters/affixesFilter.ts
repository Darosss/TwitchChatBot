import { AffixModel } from "@models/types";
import { RequestSearch } from "@types";

export const filterAffixesByUrlParams = (params: RequestSearch<AffixModel>) => {
  const { search_name } = params;
  const filterName = {
    ...(search_name && { name: { $regex: search_name, $options: "i" } }),
  };

  const searchFilter = {
    $and: [filterName],
  };
  return searchFilter;
};
