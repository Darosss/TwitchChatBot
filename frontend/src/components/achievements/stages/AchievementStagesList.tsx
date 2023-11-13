import React from "react";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import AchievementStagesData from "./AchievementStagesData";
import { useManyAchievementStagesContext } from "./ManyAchievementStagesContext";
import FilterBarStages from "./FilterBarStages";

export default function AchievementStagesList() {
  const {
    achievementStagesState: { count, currentPage },
  } = useManyAchievementStagesContext();

  return (
    <>
      <PreviousPage />
      <FilterBarStages />
      <AchievementStagesData />
      <Pagination
        className="pagination-bar"
        localStorageName="achievementStagesPageSize"
        currentPage={currentPage}
        totalCount={count}
        siblingCount={1}
      />
    </>
  );
}
