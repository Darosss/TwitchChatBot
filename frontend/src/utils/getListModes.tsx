import { PaginationData } from "@services/ApiService";
import { getMoods, Mood } from "@services/MoodService";
import { getPersonalities, Personality } from "@services/PersonalityService";
import { getTags, Tag } from "@services/TagService";

export interface AllModesReturn {
  tags: Tag[];
  personalities: Personality[];
  moods: Mood[];
  refetchTags: () => Promise<PaginationData<Tag>>;
  refetchPersonalities: () => Promise<PaginationData<Personality>>;
  refetchMoods: () => Promise<PaginationData<Mood>>;
}

export const getAllModes = (): AllModesReturn | undefined => {
  const { data: tags, refetchData: refetchTags } = getTags(false);
  const { data: personalities, refetchData: refetchPersonalities } =
    getPersonalities(false);
  const { data: moods, refetchData: refetchMoods } = getMoods(false);

  if (!tags || !personalities || !moods) return;

  return {
    tags: tags.data,
    personalities: personalities.data,
    moods: moods.data,
    refetchTags: refetchTags,
    refetchPersonalities: refetchPersonalities,
    refetchMoods: refetchMoods,
  };
};

export const generateSelectModes = (
  value: string,
  onChangeSelect: (value: string) => void,
  data?: Tag[] | Personality[] | Mood[]
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
