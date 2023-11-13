import React from "react";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import { useGetAchievements } from "@services";
import AchievementsListData from "./AchievementsListData";
import FilterBarAchievements from "./FilterBarAchievements";

export default function AchievementsList() {
  const { data: achievementsData, loading, error } = useGetAchievements();

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (loading || !achievementsData) return <> Loading...</>;
  const { data, count, currentPage } = achievementsData;

  return (
    <>
      <PreviousPage />
      <FilterBarAchievements />
      <AchievementsListData data={data} />
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
