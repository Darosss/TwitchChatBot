import { PaginationData } from "@services/ApiService";
import { useGetMoods, Mood } from "@services/MoodService";
import { useGetAffixes, Affix } from "@services/AffixService";
import { useGetTags, Tag } from "@services/TagService";

export interface AllModesReturn {
  tags: Tag[];
  affixes: Affix[];
  moods: Mood[];
  refetchTags: () => Promise<PaginationData<Tag>>;
  refetchAffixes: () => Promise<PaginationData<Affix>>;
  refetchMoods: () => Promise<PaginationData<Mood>>;
}

export const useGetAllModes = (): AllModesReturn | undefined => {
  const { data: tags, refetchData: refetchTags } = useGetTags(false);
  const { data: affixes, refetchData: refetchAffixes } = useGetAffixes(false);
  const { data: moods, refetchData: refetchMoods } = useGetMoods(false);

  if (!tags || !affixes || !moods) return;

  return {
    tags: tags.data,
    affixes: affixes.data,
    moods: moods.data,
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
