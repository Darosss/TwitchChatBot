import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import BadgesListData from "./BadgesListData";
import FilterBarBadges from "./FilterBarBadges";
import { useBadgesContext } from "./ContextManyData";

export default function BadgesList() {
  const {
    badgesState: { currentPage, count },
  } = useBadgesContext();

  return (
    <>
      <PreviousPage />
      <FilterBarBadges />
      <BadgesListData />
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          localStorageName="badgesListPageSize"
          currentPage={currentPage}
          totalCount={count}
          siblingCount={1}
        />
      </div>
    </>
  );
}
