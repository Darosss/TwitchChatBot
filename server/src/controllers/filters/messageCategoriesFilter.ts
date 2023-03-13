import { IRequestQueryMessageCategories } from "@types";

export const filterMessageCategoriesByUrlParams = async (
  params: IRequestQueryMessageCategories
) => {
  const { category, messages } = params;

  const filterCategory = {
    ...(category && { category: { $regex: category, $options: "i" } }),
  };

  const filterMessages = {
    ...(messages && { messages: { $regex: messages, $options: "i" } }),
  };

  const searchFilter = {
    $and: [filterCategory, filterMessages],
  };
  return searchFilter;
};
