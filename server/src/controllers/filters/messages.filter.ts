import { User } from "@models/user.model";
import { IRequestQueryMessage } from "@types";

const filterMessagesByUrlParams = async (params: IRequestQueryMessage) => {
  const { search_name, owner, start_date, end_date } = params;

  const searchingUserId = (await User.findOne({ username: owner }))?.id;

  const searchFilter = {
    ...(search_name && { message: { $regex: search_name, $options: "i" } }),
    ...(owner && { owner: { $eq: searchingUserId } }),
    ...(start_date &&
      end_date === undefined && { date: { $gte: new Date(start_date) } }),
    ...(end_date &&
      start_date === undefined && { date: { $lte: new Date(end_date) } }),
    ...(start_date &&
      end_date && {
        $and: [
          { date: { $gte: new Date(start_date) } },
          { date: { $lte: new Date(end_date) } },
        ],
      }),
  };

  return searchFilter;
};

export { filterMessagesByUrlParams };
