import { RequestQueryUser } from "@types";

export const filterUsersByUrlParams = (params: RequestQueryUser) => {
  const { search_name, seen_start, seen_end, privilege, created_start, created_end } = params;

  const filterLastSeen = {
    ...(seen_start && seen_end === undefined && { lastSeen: { $gte: new Date(seen_start) } }),
    ...(seen_end && seen_start === undefined && { lastSeen: { $lte: new Date(seen_end) } }),
    ...(seen_start &&
      seen_end && {
        $and: [{ lastSeen: { $gte: new Date(seen_start) } }, { lastSeen: { $lte: new Date(seen_end) } }]
      })
  };

  const filterCreated = {
    ...(created_start &&
      created_end === undefined && {
        createdAt: { $gte: new Date(created_start) }
      }),
    ...(created_end &&
      created_start === undefined && {
        createdAt: { $lte: new Date(created_end) }
      }),
    ...(created_start &&
      created_end && {
        $and: [{ createdAt: { $gte: new Date(created_start) } }, { createdAt: { $lte: new Date(created_end) } }]
      })
  };

  const filterName = {
    ...(search_name && { username: { $regex: search_name, $options: "i" } })
  };
  const filterPrivilege = {
    ...(privilege && { privileges: { $eq: privilege } })
  };

  const searchFilter = {
    $and: [filterLastSeen, filterCreated, filterName, filterPrivilege]
  };
  return searchFilter;
};
