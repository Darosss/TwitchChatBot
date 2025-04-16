import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";

import AchievementsListData from "./AchievementsListData";
import FilterBarAchievements from "./FilterBarAchievements";
import { fetchChatCommandsDefaultParams, useGetAchievements } from "@services";
import { Error, Loading } from "@components/axiosHelper";
import EditCreateAchievementModal from "./EditCreateAchievementModal";
import { useQueryParams } from "@hooks/useQueryParams";

export default function AchievementsList() {
  const queryParams = useQueryParams(fetchChatCommandsDefaultParams);
  const {
    data: achievementsData,
    isLoading,
    error,
  } = useGetAchievements(queryParams);

  if (error) return <Error error={error} />;
  if (isLoading || !achievementsData) return <Loading />;

  return (
    <>
      <PreviousPage />
      <FilterBarAchievements />
      <AchievementsListData achievements={achievementsData.data} />
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="achievementsListPageSize"
          currentPage={achievementsData.currentPage}
          totalCount={achievementsData.count}
          siblingCount={1}
        />
      </div>
      <EditCreateAchievementModal />
    </>
  );
}
