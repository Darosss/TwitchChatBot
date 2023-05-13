import { RequestCommandsQuery } from "@types";

export const filterCommandsByUrlParams = (params: RequestCommandsQuery) => {
  const { search_name, start_date, end_date, privilege, description, aliases, messages } = params;

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
  const filterPrivilege = {
    ...(privilege && { privilege: { $eq: privilege } })
  };
  const filterAliases = {
    ...(aliases && { aliases: { $regex: aliases, $options: "i" } })
  };
  const filterDescription = {
    ...(description && { description: { $regex: description, $options: "i" } })
  };
  const filterMessages = {
    ...(messages && { messages: { $regex: messages, $options: "i" } })
  };
  const searchFilter = {
    $and: [filterCreated, filterName, filterPrivilege, filterAliases, filterDescription, filterMessages]
  };
  return searchFilter;
};
