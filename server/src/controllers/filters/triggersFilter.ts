import { IRequestTriggerQuery } from "@types";

const filterTriggersByUrlParams = (params: IRequestTriggerQuery) => {
  const { search_name, start_date, end_date, words, messages } = params;

  const filterCreated = {
    ...(start_date &&
      end_date === undefined && {
        createdAt: { $gte: new Date(start_date) },
      }),
    ...(end_date &&
      start_date === undefined && {
        createdAt: { $lte: new Date(end_date) },
      }),
    ...(start_date &&
      end_date && {
        $and: [
          { createdAt: { $gte: new Date(start_date) } },
          { createdAt: { $lte: new Date(end_date) } },
        ],
      }),
  };

  const filterName = {
    ...(search_name && { name: { $regex: search_name, $options: "i" } }),
  };

  const filterWords = {
    ...(words && { words: { $regex: words, $options: "i" } }),
  };

  const filterMessages = {
    ...(messages && { messages: { $regex: messages, $options: "i" } }),
  };

  const searchFilter = {
    $and: [filterCreated, filterName, filterWords, filterMessages],
  };
  return searchFilter;
};

export { filterTriggersByUrlParams };
