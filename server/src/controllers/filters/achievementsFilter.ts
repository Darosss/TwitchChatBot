import { RequestAchievementStageQuery, RequestSearch } from "@types";

export const filterAchievementsByUrlParams = (params: RequestSearch) => {
  const { search_name } = params;
  const filterName = {
    ...(search_name && { name: { $regex: search_name, $options: "i" } })
  };

  const searchFilter = {
    $and: [filterName]
  };
  return searchFilter;
};
export const filterAchievementStagesByUrlParams = (params: RequestAchievementStageQuery) => {
  const { search_name, sound, stageName } = params;
  const filterName = {
    ...(search_name && { name: { $regex: search_name, $options: "i" } })
  };

  const stageNameFilter = {
    ...(stageName && { "stageData.name": { $regex: stageName, $options: "i" } })
  };
  const soundFilter = {
    ...(sound && { "stageData.sound": { $regex: sound, $options: "i" } })
  };
  const searchFilter = {
    $and: [filterName, stageNameFilter, soundFilter]
  };
  return searchFilter;
};
