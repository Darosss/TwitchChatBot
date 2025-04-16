import Modal from "@components/modal";
import { useEditBadge, useCreateBadge } from "@services";
import { addErrorNotification } from "@utils";
import BadgeModalData from "./BadgesModalData";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import { closeModal, setEditingId } from "@redux/badgesSlice";

export default function EditCreateBadgeModal() {
  const dispatch = useDispatch();

  const { isModalOpen, badge, editingId } = useSelector(
    (root: RootStore) => root.badges
  );
  const editBadgeMutation = useEditBadge();
  const createBadgeMutation = useCreateBadge();

  const onSubmitModalCreate = () => {
    createBadgeMutation.mutate({ newBadge: badge });
    dispatch(closeModal());
  };

  const onSubmitModalEdit = () => {
    if (!editingId) return addErrorNotification("ID badge need to be provided");
    editBadgeMutation.mutate({
      id: editingId,
      updatedBadge: badge,
    });
    dispatch(closeModal());
    dispatch(setEditingId(""));
  };

  return (
    <Modal
      title={`${editingId ? "Edit" : "Create"} badge`}
      onClose={() => dispatch(closeModal())}
      onSubmit={() => {
        editingId ? onSubmitModalEdit() : onSubmitModalCreate();
      }}
      show={isModalOpen}
    >
      <BadgeModalData />
    </Modal>
  );
}
