import { RequestBadgesQuery } from "@types";

export const filterBadgesByUrlParams = (params: RequestBadgesQuery) => {
  const { search_name, imageUrl } = params;
  const filterName = {
    ...(search_name && { name: { $regex: search_name, $options: "i" } })
  };
  const filterImageUrl = {
    ...(imageUrl && { imageUrl: { $regex: imageUrl, $options: "i" } })
  };

  const searchFilter = {
    $and: [filterName, filterImageUrl]
  };
  return searchFilter;
};
