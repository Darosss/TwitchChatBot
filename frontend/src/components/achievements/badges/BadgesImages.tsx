import PreviousPage from "@components/previousPage";
import AvailableBadgeImages, { OnClickBadgeType } from "./AvailableBadgeImages";
import { useState } from "react";
import { useDeleteBadgeImage, useGetBadgesImages } from "@services";
import Modal from "@components/modal";
import ModalDataWrapper from "@components/modalDataWrapper";
import { viteBackendUrl } from "src/configs/envVariables";
import React from "react";
import { AxiosError, Loading } from "@components/axiosHelper";
import { useAxiosWithConfirmation } from "@hooks";

export default function BadgesImages() {
  const [showModal, setShowModal] = useState(false);

  const {
    data: badgeImagesResponseData,
    loading,
    error,
    refetchData,
  } = useGetBadgesImages();
  const [choosenBadge, setChoosenBadge] = useState<OnClickBadgeType | null>(
    null
  );

  const setBadgeImageToDelete = useAxiosWithConfirmation({
    hookToProceed: useDeleteBadgeImage,
    opts: {
      onFullfiled: () => {
        refetchData();
        setShowModal(false);
      },
    },
  });

  const handleOnClickBadgeImage = (data: OnClickBadgeType) => {
    setChoosenBadge(data);
    setShowModal(true);
  };

  const handleOnHideModal = () => {
    setChoosenBadge(null);
    setShowModal(false);
  };

  if (error) return <AxiosError error={error} />;
  if (loading) return <Loading />;
  if (!badgeImagesResponseData) return null;

  return (
    <>
      <PreviousPage />
      <AvailableBadgeImages
        onClickBadge={(data) => {
          handleOnClickBadgeImage(data);
        }}
        badgesData={badgeImagesResponseData.data}
        onClickRefresh={refetchData}
        showNames={true}
      />

      <Modal
        title={`Badge image ${choosenBadge?.badgeName}`}
        onClose={handleOnHideModal}
        show={showModal}
      >
        <div className="badge-images-modal-content">
          <ModalDataWrapper>
            <div> Replace image(soon): </div>
            <div> Replace button(soon)</div>
            <div>Preview:</div>
            <div className="badge-images-modal-preview">
              {choosenBadge &&
                badgeImagesResponseData.data.availableSizes.map(
                  (size, index) => (
                    <React.Fragment key={index}>
                      <div>{size}</div>
                      <div>
                        <img
                          src={`${viteBackendUrl}\\${choosenBadge.basePath}\\${choosenBadge.badgeName}${badgeImagesResponseData.data.separatorSizes}${size}${choosenBadge.badgeExtension}`}
                          alt={`${size}`}
                        />
                      </div>
                    </React.Fragment>
                  )
                )}
            </div>
            <div>
              <button
                className="danger-button common-button"
                onClick={() =>
                  setBadgeImageToDelete(
                    `${choosenBadge?.badgeName}${choosenBadge?.badgeExtension}`
                  )
                }
              >
                Delete
              </button>
            </div>
          </ModalDataWrapper>
        </div>
      </Modal>
    </>
  );
}
