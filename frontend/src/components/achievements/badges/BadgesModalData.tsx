import ModalDataWrapper from "@components/modalDataWrapper";
import AvailableBadgeImages from "./AvailableBadgeImages";
import { useBadgeContextEditCreateData } from "./ContextEditCreateData";
import { BadgeModelImagesUrls, useGetBadgesImages } from "@services";
import { viteBackendUrl } from "src/configs/envVariables";

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

  const { data } = badgeImagesResponseData;
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
      <div className="badges-modal-data-images">
        {Object.keys(state.imagesUrls).map((key, index) => {
          const keyAsKeyOfBadgeImagesUrlsState =
            key as keyof BadgeModelImagesUrls;
          return (
            <div key={index}>
              {key}
              {state.imagesUrls[keyAsKeyOfBadgeImagesUrlsState] ? (
                <img
                  src={`${viteBackendUrl}\\${state.imagesUrls[keyAsKeyOfBadgeImagesUrlsState]}`}
                  alt={key}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <div>
        <AvailableBadgeImages
          className="available-badge-images-modal-edit"
          onClickRefresh={refetchData}
          badgesData={data}
          onClickBadge={({ basePath, badgeName, badgeExtension }) => {
            const updatePayloadData: Partial<BadgeModelImagesUrls> = {};
            Object.keys(state.imagesUrls).forEach((key) => {
              const foundSize = data.availableSizes.find((size) =>
                key.includes(String(size))
              );
              updatePayloadData[
                key as keyof BadgeModelImagesUrls
              ] = `${basePath}\\${badgeName}${data.separatorSizes}${foundSize}${badgeExtension}`;
            });

            dispatch({
              type: "SET_IMAGES_URLS",
              payload: {
                ...state.imagesUrls,
                ...updatePayloadData,
              },
            });
          }}
          currentImgPath={state.imagesUrls.x128}
        />
      </div>
    </ModalDataWrapper>
  );
}
