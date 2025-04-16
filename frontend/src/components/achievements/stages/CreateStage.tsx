import Modal from "@components/modal";
import { useCreateAchievementStage } from "@services";
import { useState } from "react";

export default function CreateStages() {
  const [showModal, setShowModal] = useState(false);
  const [newStageName, setNewStageName] = useState("");

  const createAchievementStageMutation = useCreateAchievementStage();

  const handleOnSubmit = () => {
    createAchievementStageMutation.mutate({
      name: newStageName,
      stageData: [],
    });
  };
  return (
    <>
      <button
        className="common-button primary-button"
        onClick={(e) => setShowModal(true)}
      >
        New
      </button>

      <Modal
        title="Create new achievement stage"
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleOnSubmit}
      >
        <div className="create-stage-modal-content">
          <label>Name</label>
          <input
            type="text"
            placeholder="name"
            value={newStageName}
            onChange={(e) => setNewStageName(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}
