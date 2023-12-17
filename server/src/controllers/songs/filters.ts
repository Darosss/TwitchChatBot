import { RequestSongsQuery } from "./types";

export const filterSongsByUrlParams = (params: RequestSongsQuery) => {
  const { search_name, start_date, end_date, customId } = params;

  const filterCreated = {
    ...(start_date &&
      end_date === undefined && {
        createdAt: { $gte: new Date(start_date) }
      }),
    ...(end_date &&
      start_date === undefined && {
        createdAt: { $lte: new Date(end_date) }
      }),
    ...(start_date &&
      end_date && {
        $and: [{ createdAt: { $gte: new Date(start_date) } }, { createdAt: { $lte: new Date(end_date) } }]
      })
  };

  const filterName = {
    ...(search_name && { name: { $regex: search_name, $options: "i" } })
  };

  const filterCustomId = {
    ...(customId && { customId: { $regex: search_name, $options: "i" } })
  };

  const searchFilter = {
    $and: [filterCreated, filterName, filterCustomId]
  };
  return searchFilter;
};
