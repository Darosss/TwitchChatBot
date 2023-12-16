import { TableListWrapper } from "@components/tableWrapper";
import { BadgeContextEditCreateDataProvider } from "./ContextEditCreateData";
import EditCreateBadgeModal from "./EditCreateBadgeModal";
import THeadBadgeData from "./THeadBadgeData";
import TBodyManyBadgesData from "./TBodyBadgeData";

export default function BadgesListData() {
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
