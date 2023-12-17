import { RequestBadgesQuery } from "./types";

export const filterBadgesByUrlParams = (params: RequestBadgesQuery) => {
  const { search_name, imagesUrls } = params;
  const filterName = {
    ...(search_name && { name: { $regex: search_name, $options: "i" } })
  };
  const filterImageUrl = {
    ...(imagesUrls && { "imagesUrls.x128": { $regex: imagesUrls, $options: "i" } })
  };

  const searchFilter = {
    $and: [filterName, filterImageUrl]
  };
  return searchFilter;
};
