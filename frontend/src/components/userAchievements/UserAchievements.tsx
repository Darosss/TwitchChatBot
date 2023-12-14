import PreviousPage from "@components/previousPage";
import { useGetAchievements } from "@services";
import AchievementStageLists from "./AchievementStagesList";
import Pagination from "@components/pagination";
import { useLocalStorage } from "@hooks";
import { AxiosError, Loading } from "@components/axiosHelper";

export default function UserAchievements() {
  const { data: achievementsData, loading, error } = useGetAchievements();

  const [expandAllSections, setExpandAllSections] = useLocalStorage(
    "expandAllAchievements",
    false
  );

  if (error) return <AxiosError error={error} />;
  if (!achievementsData || loading) return <Loading />;

  const { data, count, currentPage } = achievementsData;
  return (
    <>
      <PreviousPage />
      <div className="user-achievements-header">
        <div>User achievements</div>
        <button
          className="common-button primary-button"
          onClick={() => setExpandAllSections(!expandAllSections)}
        >
          {expandAllSections ? "Expanded" : "Expand all"}
        </button>
      </div>

      <div className="achievements-list-header-wrapper">
        <div>Name</div>
        <div>Progress</div>
        <div>Obtained at </div>
        <div>Badge</div>
      </div>
      <div className="table-list-wrapper">
        {data.map((achievement, index) => (
          <AchievementStageLists
            key={index}
            achievement={achievement}
            expandAll={expandAllSections}
          />
        ))}
      </div>
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="userAchievementsPageSize"
          currentPage={currentPage}
          totalCount={count}
          siblingCount={1}
        />
      </div>
    </>
  );
}
