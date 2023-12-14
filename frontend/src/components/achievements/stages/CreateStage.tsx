import Modal from "@components/modal";
import { useCreateAchievementStage } from "@services";
import { addSuccessNotification } from "@utils";
import { useState } from "react";
import { useManyAchievementStagesContext } from "./ManyAchievementStagesContext";

export default function CreateStages() {
  const [showModal, setShowModal] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const { refetchStages } = useManyAchievementStagesContext();
  const { refetchData: fetchCreateStage } = useCreateAchievementStage({
    name: newStageName,
    stageData: [],
  });

  const handleOnSubmit = () => {
    fetchCreateStage().then(() => {
      addSuccessNotification("Stage added successfully.");
      refetchStages();
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
