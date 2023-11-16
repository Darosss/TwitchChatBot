import React from "react";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";

import AchievementsListData from "./AchievementsListData";
import FilterBarAchievements from "./FilterBarAchievements";
import { useAchievementsListContext } from "./AchievementsContext";
import { ManageAchievementContextProvider } from "./ManageAchievementContext";

export default function AchievementsList() {
  const {
    achievementsState: { count, currentPage },
  } = useAchievementsListContext();

  return (
    <>
      <PreviousPage />
      <FilterBarAchievements />
      <ManageAchievementContextProvider>
        <AchievementsListData />
      </ManageAchievementContextProvider>
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="achievementsListPageSize"
          currentPage={currentPage}
          totalCount={count}
          siblingCount={1}
        />
      </div>
    </>
  );
}
