import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import AchievementStagesData from "./AchievementStagesData";
import FilterBarStages from "./FilterBarStages";
import { useGetAchievementStages } from "@services";
import { Error, Loading } from "@components/axiosHelper";

export default function AchievementStagesList() {
  const { data: stagesData, isLoading, error } = useGetAchievementStages();

  if (error) return <Error error={error} />;
  if (isLoading || !stagesData) return <Loading />;

  return (
    <>
      <PreviousPage />
      <FilterBarStages />
      <AchievementStagesData data={stagesData.data} />
      <Pagination
        className="pagination-bar"
        localStorageName="achievementStagesPageSize"
        currentPage={stagesData.currentPage}
        totalCount={stagesData.count}
        siblingCount={1}
      />
    </>
  );
}
