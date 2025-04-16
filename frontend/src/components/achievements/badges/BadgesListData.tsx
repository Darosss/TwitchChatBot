import { TableListWrapper } from "@components/tableWrapper";
import EditCreateBadgeModal from "./EditCreateBadgeModal";
import THeadBadgeData from "./THeadBadgeData";
import TBodyManyBadgesData from "./TBodyBadgeData";
import { Badge } from "@services";

interface BadgesListDataProps {
badges:Badge[]
}

export default function BadgesListData({badges}:BadgesListDataProps) {
  return (
    <div className="badges-list-data-wrapper">
      <TableListWrapper
        theadChildren={<THeadBadgeData />}
        tbodyChildren={<TBodyManyBadgesData badges={badges} />}
      />
      <EditCreateBadgeModal />
    </div>
  );
}
