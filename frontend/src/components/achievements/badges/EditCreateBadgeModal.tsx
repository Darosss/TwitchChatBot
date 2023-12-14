import Modal from "@components/modal";
import { useEditBadge, useCreateBadge } from "@services";
import { addSuccessNotification } from "@utils";
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
    fetchCreateBadge().then(() => {
      addSuccessNotification("Badge created successfully");
      setShowModal(false);
      refetchBadgeData();
    });
  };
  const onSubmitModalEdit = () => {
    fetchEditBadge().then(() => {
      addSuccessNotification("Badge edited successfully");
      setShowModal(false);
      refetchBadgeData();
    });
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
