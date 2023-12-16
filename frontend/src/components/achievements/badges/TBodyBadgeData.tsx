import { DateTooltip } from "@components/dateTooltip";
import { viteBackendUrl } from "src/configs/envVariables";
import { useBadgeContextEditCreateData } from "./ContextEditCreateData";
import { useBadgesContext } from "./ContextManyData";

export default function TBodyManyBadgesData() {
  const {
    badgesState: { data },
    setBadgeIdToDelete,
  } = useBadgesContext();
  const {
    badgeState: [, dispatch],
    showModalState: [, setModalState],
  } = useBadgeContextEditCreateData();

  return (
    <>
      {data.map((badge, index) => {
        return (
          <tr key={index} className="badges-list-data-tbody">
            <td>
              <div className="badge-data-table-actions">
                <button
                  className="common-button primary-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: "SET_STATE", payload: badge });
                    setModalState(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="common-button danger-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBadgeIdToDelete(badge._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </td>
            <td>{badge.name}</td>
            <td>
              <div className="badge-image-wrapper">
                <div>{badge.imagesUrls.x128}</div>
                <img
                  src={`${viteBackendUrl}/${badge.imagesUrls.x128}`}
                  alt={badge.imagesUrls.x128}
                />
              </div>
            </td>
            <td>{badge.description}</td>

            <td className="badge-table-data">
              <DateTooltip date={badge.createdAt} />
            </td>
            <td className="badge-table-data">
              <DateTooltip date={badge.updatedAt} />
            </td>
          </tr>
        );
      })}
    </>
  );
}
