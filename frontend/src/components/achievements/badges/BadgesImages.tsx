import PreviousPage from "@components/previousPage";
import AvailableBadgeImages, { OnClickBadgeType } from "./AvailableBadgeImages";
import { useEffect, useState } from "react";
import { handleActionOnChangeState, addNotification } from "@utils";
import { useDeleteBadgeImage, useGetBadgesImages } from "@services";
import Modal from "@components/modal";
import ModalDataWrapper from "@components/modalDataWrapper";
import { viteBackendUrl } from "src/configs/envVariables";
import React from "react";

export default function BadgesImages() {
  const [showModal, setShowModal] = useState(false);
  const [badgeImageNameToDelete, setBadgeImageNameToDelete] = useState<
    string | null
  >(null);

  const {
    data: badgeImagesResponseData,
    loading,
    error,
    refetchData,
  } = useGetBadgesImages();
  const [choosenBadge, setChoosenBadge] = useState<OnClickBadgeType | null>(
    null
  );

  const { refetchData: fetchDeleteBadge } = useDeleteBadgeImage(
    badgeImageNameToDelete || ""
  );

  useEffect(() => {
    handleActionOnChangeState(
      badgeImageNameToDelete,
      setBadgeImageNameToDelete,
      () => {
        fetchDeleteBadge()
          .then((data) => {
            setBadgeImageNameToDelete(null);
            refetchData();
            setShowModal(false);
            addNotification("Deleted", data.message, "danger");
          })
          .catch((err) =>
            addNotification(
              "Deleted",
              `Badge image cannot be deleted. ${err.response?.data?.message}`,
              "danger"
            )
          );
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [badgeImageNameToDelete]);

  const handleOnClickBadgeImage = (data: OnClickBadgeType) => {
    setChoosenBadge(data);
    setShowModal(true);
  };

  const handleOnHideModal = () => {
    setChoosenBadge(null);
    setShowModal(false);
  };

  if (loading) return <>Loading</>;
  if (error) return <>There is an error. {error.response?.data.message}</>;
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
                  setBadgeImageNameToDelete(
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
