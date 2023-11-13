import Modal from "@components/modal";
import { useEditBadge, useCreateBadge } from "@services";
import { addNotification } from "@utils";
import BadgeModalData from "./BadgesModalData";
import { useBadgeContextEditCreateData } from "./ContextEditCreateData";
import { useBadgesContext } from "./ContextManyData";

export default function EditCreateBadgeModal() {
  const {
    badgeState: [{ _id, ...restBadgeState }],
    showModalState: [showModal, setShowModal],
  } = useBadgeContextEditCreateData();

  const { refetchBadgeData } = useBadgesContext();
  const { refetchData: fetchEditBadge } = useEditBadge(_id, restBadgeState);
  const { refetchData: fetchCreateBadge } = useCreateBadge(restBadgeState);

  const onSubmitModalCreate = () => {
    fetchCreateBadge()
      .then(() => {
        addNotification("Success", "Badge created successfully", "success");
        setShowModal(false);
        refetchBadgeData();
      })
      .catch((err) =>
        addNotification(
          "ERROR",
          err.response?.data?.message || "Couldn't create badge",
          "danger"
        )
      );
  };
  const onSubmitModalEdit = () => {
    fetchEditBadge()
      .then(() => {
        addNotification("Success", "Badge edited successfully", "success");
        setShowModal(false);
        refetchBadgeData();
      })
      .catch((err) =>
        addNotification(
          "ERROR",
          err.response?.data?.message || "Couldn't update badge",
          "danger"
        )
      );
  };

  return (
    <Modal
      title={`${_id ? "Edit" : "Create"} badge`}
      onClose={() => setShowModal(false)}
      onSubmit={() => {
        _id ? onSubmitModalEdit() : onSubmitModalCreate();
      }}
      show={showModal}
    >
      <BadgeModalData />
    </Modal>
  );
}
