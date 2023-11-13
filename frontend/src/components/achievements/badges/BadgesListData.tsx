import { TableListWrapper } from "@components/tableWrapper";
import { useDeleteBadge } from "@services";
import { useBadgesContext } from "./ContextManyData";
import { handleActionOnChangeState, addNotification } from "@utils";
import { useState, useEffect } from "react";
import { BadgeContextEditCreateDataProvider } from "./ContextEditCreateData";
import EditCreateBadgeModal from "./EditCreateBadgeModal";
import THeadBadgeData from "./THeadBadgeData";
import TBodyManyBadgesData from "./TBodyBadgeData";

export default function BadgesListData() {
  const { refetchBadgeData } = useBadgesContext();
  const [badgeIdToDelete, setBadgeIdToDelete] = useState<string | null>(null);

  const { refetchData: fetchDeleteBadge } = useDeleteBadge(
    badgeIdToDelete || ""
  );

  useEffect(() => {
    handleActionOnChangeState(badgeIdToDelete, setBadgeIdToDelete, () => {
      fetchDeleteBadge()
        .then(() => {
          refetchBadgeData();
          addNotification("Deleted", "Badge deleted successfully", "danger");
          setBadgeIdToDelete(null);
        })
        .catch((err) =>
          addNotification(
            "Deleted",
            `Badge cannot be deleted. ${err.response?.data?.message}`,
            "danger"
          )
        );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [badgeIdToDelete]);
  return (
    <div className="badges-list-data-wrapper">
      <BadgeContextEditCreateDataProvider>
        <TableListWrapper
          theadChildren={<THeadBadgeData />}
          tbodyChildren={<TBodyManyBadgesData />}
        />
        <EditCreateBadgeModal />
      </BadgeContextEditCreateDataProvider>
    </div>
  );
}
