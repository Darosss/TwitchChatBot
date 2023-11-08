import { RequestSearch } from "@types";

export const filterAchievementsByUrlParams = (params: RequestSearch) => {
  const { search_name, stages, tag } = params;
  const filterName = {
    ...(search_name && { name: { $regex: search_name, $options: "i" } })
  };

  const filterStages = {
    ...(stages && { stages: { name: { $regex: stages, $options: "i" } } })
  };

  const filterTag = {
    ...(tag && { tag: { name: { $regex: tag, $options: "i" } } })
  };

  const searchFilter = {
    $and: [filterName, filterStages, filterTag]
  };
  return searchFilter;
};
