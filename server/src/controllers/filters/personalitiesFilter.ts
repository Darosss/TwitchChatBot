import { PersonalityModel } from "@models/types";
import { RequestSearch } from "@types";

export const filterPersonalitiesByUrlParams = (
  params: RequestSearch<PersonalityModel>
) => {
  const { search_name } = params;
  const filterName = {
    ...(search_name && { name: { $regex: search_name, $options: "i" } }),
  };

  const searchFilter = {
    $and: [filterName],
  };
  return searchFilter;
};
