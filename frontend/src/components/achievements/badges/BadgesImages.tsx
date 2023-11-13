import PreviousPage from "@components/previousPage";
import AvailableBadgeImages from "./AvailableBadgeImages";
import { useEffect, useState } from "react";
import { handleActionOnChangeState, addNotification } from "@utils";
import { useDeleteBadgeImage, useGetBadgesImages } from "@services";
import Modal from "@components/modal";

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

  const [choosenBadge, setChoosenBadge] = useState<string | null>(null);

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

  const handleOnClickBadgeImage = (url: string) => {
    setChoosenBadge(url);
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
        onClickBadge={({ badgeName }) => {
          handleOnClickBadgeImage(badgeName);
        }}
        badgePaths={badgeImagesResponseData.data}
        onClickRefresh={refetchData}
        showNames={true}
      />

      <Modal
        title={`Badge image ${choosenBadge}`}
        onClose={handleOnHideModal}
        show={showModal}
      >
        <div className="badge-images-modal-content">
          <div> Rename image </div>
          <div> Replace image </div>
          <button
            className="danger-button common-button"
            onClick={() => setBadgeImageNameToDelete(choosenBadge)}
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
