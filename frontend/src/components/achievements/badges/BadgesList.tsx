import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import BadgesListData from "./BadgesListData";
import FilterBarBadges from "./FilterBarBadges";
import { useGetBadges } from "@services";
import { Error, Loading } from "@components/axiosHelper";

export default function BadgesList() {
  const { data: badges, isLoading, error } = useGetBadges();
  if (error) return <Error error={error} />;
  if (isLoading || !badges) return <Loading />;

  return (
    <>
      <PreviousPage />
      <FilterBarBadges />
      <BadgesListData badges={badges.data} />
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="badgesListPageSize"
          currentPage={badges.currentPage}
          totalCount={badges.count}
          siblingCount={1}
        />
      </div>
    </>
  );
}
