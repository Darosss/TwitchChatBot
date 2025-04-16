import ModalDataWrapper from "@components/modalDataWrapper";
import AvailableBadgeImages from "./AvailableBadgeImages";
import { BadgeModelImagesUrls, useGetBadgesImages } from "@services";
import { viteBackendUrl } from "@configs/envVariables";
import { Error, Loading } from "@components/axiosHelper";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import { setDescription, setImagesUrls, setName } from "@redux/badgesSlice";

export default function BadgeModalData() {
  const {
    data: badgeImagesResponseData,
    isLoading,
    error,
  } = useGetBadgesImages();
  const dispatch = useDispatch();
  const { badge } = useSelector((root: RootStore) => root.badges);

  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!badgeImagesResponseData) return null;

  const { data } = badgeImagesResponseData;
  return (
    <ModalDataWrapper>
      <div>Name</div>
      <div>
        <input
          type="text"
          value={badge.name}
          onChange={(e) => dispatch(setName(e.target.value))}
        />
      </div>
      <div>Description</div>
      <div>
        <input
          type="text"
          value={badge.description}
          onChange={(e) => dispatch(setDescription(e.target.value))}
        />
      </div>
      <div className="badges-modal-data-images">
        {Object.keys(badge.imagesUrls).map((key, index) => {
          const keyAsKeyOfBadgeImagesUrlsState =
            key as keyof BadgeModelImagesUrls;
          return (
            <div key={index}>
              {key}
              {badge.imagesUrls[keyAsKeyOfBadgeImagesUrlsState] ? (
                <img
                  src={`${viteBackendUrl}\\${badge.imagesUrls[keyAsKeyOfBadgeImagesUrlsState]}`}
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
          badgesData={data}
          onClickBadge={({ basePath, badgeName, badgeExtension }) => {
            const updatePayloadData: Partial<BadgeModelImagesUrls> = {};
            Object.keys(badge.imagesUrls).forEach((key) => {
              const foundSize = data.availableSizes.find((size) =>
                key.includes(String(size))
              );
              updatePayloadData[
                key as keyof BadgeModelImagesUrls
              ] = `${basePath}\\${badgeName}${data.separatorSizes}${foundSize}${badgeExtension}`;
            });

            dispatch(
              setImagesUrls({
                ...badge.imagesUrls,
                ...updatePayloadData,
              })
            );
          }}
          currentImgPath={badge.imagesUrls.x128}
        />
      </div>
    </ModalDataWrapper>
  );
}
