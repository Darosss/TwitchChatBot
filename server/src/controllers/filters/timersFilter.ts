import { RequestTimerQuery } from "@types";

export const filterTimersByUrlParams = (params: RequestTimerQuery) => {
  const { search_name, messages } = params;

  const filterName = {
    ...(search_name && { name: { $regex: search_name, $options: "i" } })
  };

  const filterMessages = {
    ...(messages && { messages: { $regex: messages, $options: "i" } })
  };

  const searchFilter = {
    $and: [filterName, filterMessages]
  };
  return searchFilter;
};
