import { useDebouncedValue } from "@hooks/useDebouncedValue";
import { AchievementStage, useGetAchievementStages } from "@services";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

interface AchievementStageSelectValue {
  value: string;
  label: string;
}

type UseSelectAchievementStagesParams =
  | {
      stageId: string;
    }
  | {
      stage: AchievementStage;
    };

export interface SelectAchievementStagesProps {
  params: UseSelectAchievementStagesParams;
  onChangeSelect: (data: AchievementStageSelectValue) => void;
}

export const SelectAchievementStages = ({
  params,
  onChangeSelect,
}: SelectAchievementStagesProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [achievementStagesNameFilter, setAchievementStagesNameFilter] =
    useState("");
  const debouncedSearchInput = useDebouncedValue(searchInput, 300);
  const { data: achievementStagesResponse, refetch: refetchAchievementStages } =
    useGetAchievementStages({ search_name: achievementStagesNameFilter });
  const options = achievementStagesResponse?.data?.map((value) => ({
    value: value._id,
    label: value.name,
  }));
  useEffect(() => {
    setAchievementStagesNameFilter(debouncedSearchInput);
  }, [debouncedSearchInput]);

  const defaultValue =
    "stageId" in params
      ? {
          label:
            achievementStagesResponse?.data.find(
              (data) => data._id === params.stageId
            )?.name || "-",
          value: params.stageId,
        }
      : { label: params.stage.name, value: params.stage._id };

  return (
    <div>
      <Select
        styles={{
          option: (styles) => ({ ...styles, color: "black" }),
        }}
        value={defaultValue}
        isSearchable={true}
        onInputChange={(value, { action }) => {
          if (action === "input-change") {
            setSearchInput(value);
          }
        }}
        options={options}
        onChange={(value) => (value ? onChangeSelect(value) : null)}
      />
      <div className="stages-actions">
        <button
          className="common-button secondary-button"
          onClick={() => refetchAchievementStages()}
        >
          🔃
        </button>
        <Link
          to="/achievements/stages"
          target="_blank"
          className="common-button tertiary-button"
        >
          Create
        </Link>
      </div>
    </div>
  );
};
