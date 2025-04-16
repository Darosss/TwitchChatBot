import {
  Tag,
  Affix,
  Mood,
  PaginationData,
  useGetTags,
  useGetAffixes,
  useGetMoods,
} from "@services";
import { QueryObserverResult } from "react-query";

export interface AllModesReturn {
  tags: Tag[];
  affixes: Affix[];
  moods: Mood[];
  refetchTags: () => Promise<QueryObserverResult<PaginationData<Tag>, unknown>>;
  refetchAffixes: () => Promise<
    QueryObserverResult<PaginationData<Affix>, unknown>
  >;
  refetchMoods: () => Promise<
    QueryObserverResult<PaginationData<Mood>, unknown>
  >;
}

export const useGetAllModes = (): AllModesReturn => {
  const { data: tags, refetch: refetchTags } = useGetTags();
  const { data: affixes, refetch: refetchAffixes } = useGetAffixes();
  const { data: moods, refetch: refetchMoods } = useGetMoods();

  return {
    tags: tags?.data || [],
    affixes: affixes?.data || [],
    moods: moods?.data || [],
    refetchTags: refetchTags,
    refetchAffixes: refetchAffixes,
    refetchMoods: refetchMoods,
  };
};

export const generateSelectModes = (
  value: string,
  onChangeSelect: (value: string) => void,
  data?: Tag[] | Affix[] | Mood[]
) => {
  return (
    <select value={value} onChange={(e) => onChangeSelect(e.target.value)}>
      <option value=""></option>
      {data?.map((item, index) => {
        return (
          <option
            style={{ backgroundColor: `${item.enabled ? "green" : "red"}` }}
            key={index}
            value={item._id}
          >
            {item.name}
          </option>
        );
      })}
    </select>
  );
};
