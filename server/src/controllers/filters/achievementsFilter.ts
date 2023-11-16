import { RequestAchievementQuery, RequestAchievementStageQuery } from "@types";

export const filterAchievementsByUrlParams = (params: RequestAchievementQuery) => {
  const { search_name, custom_action } = params;
  const filterName = {
    ...(search_name && { name: { $regex: search_name, $options: "i" } })
  };
  const filterCustomAction = {
    ...(custom_action && { "custom.action": { $regex: custom_action, $options: "i" } })
  };
  const searchFilter = {
    $and: [filterName, filterCustomAction]
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
