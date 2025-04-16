import { QueryParams } from "@services";
import { useSearchParams } from "react-router-dom";

const getQueryValue = (
  searchParams: URLSearchParams,
  key: string,
  defaultValue: string | number = ""
): string | number => {
  const value = searchParams.get(key);
  if (typeof defaultValue === "number") {
    return value ? parseInt(value, 10) : defaultValue;
  }
  return value || defaultValue;
};

export const useQueryParams = <KeyType extends string>(
  defaults: QueryParams<KeyType>
): QueryParams<KeyType> => {
  const [searchParams] = useSearchParams();

  const queryParams = Object.keys(defaults).reduce(
    (acc: QueryParams<KeyType>, key) => {
      acc[key as KeyType] = getQueryValue(
        searchParams,
        key,
        defaults[key as KeyType]!
      );
      return acc;
    },
    {} as QueryParams<KeyType>
  );

  return queryParams;
};
