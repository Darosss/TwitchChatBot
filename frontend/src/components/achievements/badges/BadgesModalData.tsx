import ModalDataWrapper from "@components/modalDataWrapper";
import AvailableBadgeImages from "./AvailableBadgeImages";
import { useBadgeContextEditCreateData } from "./ContextEditCreateData";
import { useGetBadgesImages } from "@services";

export default function BadgeModalData() {
  const {
    badgeState: [state, dispatch],
  } = useBadgeContextEditCreateData();
  const {
    data: badgeImagesResponseData,
    loading,
    error,
    refetchData,
  } = useGetBadgesImages();
  if (loading) return <>Loading</>;
  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!badgeImagesResponseData) return null;

  return (
    <ModalDataWrapper>
      <div>Name</div>
      <div>
        <input
          type="text"
          value={state.name}
          onChange={(e) =>
            dispatch({ type: "SET_NAME", payload: e.target.value })
          }
        />
      </div>
      <div>Description</div>
      <div>
        <input
          type="text"
          value={state.description}
          onChange={(e) =>
            dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
          }
        />
      </div>
      <div>Image </div>

      <div>
        <AvailableBadgeImages
          className="available-badge-images-modal-edit"
          onClickRefresh={refetchData}
          badgePaths={badgeImagesResponseData.data}
          onClickBadge={({ basePath, badgeName }) =>
            dispatch({
              type: "SET_IMAGE_URL",
              payload: `${basePath}\\${badgeName}`,
            })
          }
          currentImgPath={state.imageUrl}
        />
      </div>
    </ModalDataWrapper>
  );
}
