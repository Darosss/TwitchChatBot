import { Error, Loading } from "@components/axiosHelper";
import Pagination from "@components/pagination";
import { Badge, useGetBadges } from "@services";
import { viteBackendUrl } from "@configs/envVariables";

interface ModalBadgesListProps {
  onClickBadge: (badge: Badge) => void;
}

export default function ModalBadgesList({
  onClickBadge,
}: ModalBadgesListProps) {
  const { data: badgesData, isLoading, error } = useGetBadges();
  if (error) return <Error error={error} />;
  if (isLoading || !badgesData) return <Loading />;

  const { data, count, currentPage } = badgesData;

  return (
    <>
      <div className="modal-badges-list-wrapper">
        {data.map((badge) => (
          <div key={badge._id} onClick={() => onClickBadge(badge)}>
            <img
              src={`${viteBackendUrl}/${badge.imagesUrls.x64}`}
              alt={badge.name}
            />
          </div>
        ))}
      </div>
      <Pagination
        totalCount={count}
        currentPage={currentPage}
        siblingCount={1}
        localStorageName="modalBadgesListPageSize"
        className="modal-badges-list-pagination"
      />
    </>
  );
}
