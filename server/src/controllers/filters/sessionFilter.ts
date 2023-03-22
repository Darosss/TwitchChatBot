import { RequestQuerySession } from "@types";

export const filterSessionByUrlParams = (params: RequestQuerySession) => {
  const { search_name, start_date, end_date, tags, categories } = params;

  const filterTitles = {
    ...(search_name && {
      sessionTitles: { $regex: search_name, $options: "i" },
    }),
  };

  const filterCategories = {
    ...(categories && { categories: { $regex: categories, $options: "i" } }),
  };
  const filterTags = {
    ...(tags && { tags: { $regex: tags, $options: "i" } }),
  };

  const filterStarted = {
    ...(start_date &&
      end_date === undefined && {
        sessionStart: { $gte: new Date(start_date) },
      }),
    ...(end_date &&
      start_date === undefined && {
        sessionStart: { $lte: new Date(end_date) },
      }),
    ...(start_date &&
      end_date && {
        $and: [
          { sessionStart: { $gte: new Date(start_date) } },
          { sessionStart: { $lte: new Date(end_date) } },
        ],
      }),
  };

  const searchFilter = {
    $and: [filterTitles, filterCategories, filterTags, filterStarted],
  };

  return searchFilter;
};
