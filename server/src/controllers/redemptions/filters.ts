import { RequestRedemptionQuery } from "./types";

export const filterRedemptionsByUrlParams = (params: RequestRedemptionQuery) => {
  const { search_name, start_date, end_date, receiver, cost, message } = params;

  const filterDate = {
    ...(start_date &&
      end_date === undefined && {
        redemptionDate: { $gte: new Date(start_date) }
      }),
    ...(end_date &&
      start_date === undefined && {
        redemptionDate: { $lte: new Date(end_date) }
      }),
    ...(start_date &&
      end_date && {
        $and: [{ redemptionDate: { $gte: new Date(start_date) } }, { redemptionDate: { $lte: new Date(end_date) } }]
      })
  };

  const filterName = {
    ...(search_name && { rewardTitle: { $regex: search_name, $options: "i" } })
  };
  const filterReceiver = {
    ...(receiver && { userDisplayName: { $regex: receiver, $options: "i" } })
  };
  const filterCost = {
    ...(cost && { rewardCost: { $eq: cost } })
  };
  const filterMessage = {
    ...(message && { message: { $regex: message, $options: "i" } })
  };

  const searchFilter = {
    $and: [filterDate, filterName, filterReceiver, filterCost, filterMessage]
  };
  return searchFilter;
};
