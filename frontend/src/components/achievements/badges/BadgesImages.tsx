import PreviousPage from "@components/previousPage";
import AvailableBadgeImages from "./AvailableBadgeImages";
import { useState } from "react";
import { useDeleteBadgeImage, useGetBadgesImages } from "@services";
import Modal from "@components/modal";
import ModalDataWrapper from "@components/modalDataWrapper";
import { viteBackendUrl } from "@configs/envVariables";
import React from "react";
import { Error, Loading } from "@components/axiosHelper";
import { OnClickBadgeType } from "./types";
import { closeModal, openModal } from "@redux/badgesSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";

export default function BadgesImages() {
  const dispatch = useDispatch();
  const { isModalOpen } = useSelector((root: RootStore) => root.badges);

  const {
    data: badgeImagesResponseData,
    isLoading,
    error,
  } = useGetBadgesImages();
  const [choosenBadge, setChoosenBadge] = useState<OnClickBadgeType | null>(
    null
  );
  const deleteBadgeMutation = useDeleteBadgeImage();
  const handleDeleteBadge = () => {
    if (
      !choosenBadge ||
      !window.confirm(
        `Are you sure you want to delete the badge: ${choosenBadge.badgeName}.${choosenBadge.badgeExtension}?`
      )
    )
      return;
    deleteBadgeMutation.mutate(
      `${choosenBadge?.badgeName}${choosenBadge?.badgeExtension}`
    );
  };
  const handleOnClickBadgeImage = (data: OnClickBadgeType) => {
    setChoosenBadge(data);
    dispatch(openModal());
  };

  const handleOnHideModal = () => {
    setChoosenBadge(null);
    dispatch(closeModal());
  };

  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
  if (!badgeImagesResponseData) return null;

  return (
    <>
      <PreviousPage />
      <AvailableBadgeImages
        onClickBadge={(data) => {
          handleOnClickBadgeImage(data);
        }}
        badgesData={badgeImagesResponseData.data}
        showNames={true}
      />

      <Modal
        title={`Badge image ${choosenBadge?.badgeName}`}
        onClose={handleOnHideModal}
        show={isModalOpen}
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
                onClick={handleDeleteBadge}
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
