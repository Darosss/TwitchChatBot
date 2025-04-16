import Modal from "@components/modal";
import { useFileUpload } from "@hooks";
import { setCost, setEditingAlertSound, closeModal } from "@redux/rewardsSlice";
import { setTitle } from "@redux/songsSlice";
import { RootStore } from "@redux/store";
import { uploadMp3Data } from "@services";
import { useSocketContext } from "@socket";
import { addErrorNotification, addSuccessNotification } from "@utils";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function RewardsModal() {
  const socketContext = useSocketContext();

  const [fileList, setFileList] = useState<FileList | null>(null);

  const { handleFileUpload } = useFileUpload(uploadMp3Data.rewardsAlertSounds);
  const {
    reward: { title, cost },
    isModalOpen,
    editingId,
  } = useSelector((state: RootStore) => state.rewards);

  const dispatch = useDispatch();

  const emitEditAlertSoundReward = useCallback(() => {
    const {
      emits: { updateCustomReward },
    } = socketContext;
    if (!editingId) return;
    if (fileList && fileList.length <= 0) {
      addErrorNotification("You must add sound file to update alert sound");
      return;
    }
    updateCustomReward(editingId, { title, cost }, (success) => {
      if (!success) {
        addErrorNotification("Custom reward couldn't be created");
        return;
      }

      handleFileUpload(
        {
          fileList: fileList,
          bodySingleFileName: { bodyName: "title", value: title },
        },
        "alertSound"
      );

      setFileList(null);
      addSuccessNotification("Custom reward created successfully");
    });
  }, [socketContext, editingId, fileList, handleFileUpload, title, cost]);
  const emitCreateAlertSoundReward = useCallback(() => {
    if (!title || !fileList) return;
    const {
      emits: { getCustomRewards, createCustomReward },
    } = socketContext;
    if (fileList && fileList.length <= 0) {
      addErrorNotification("You must add sound file to create alert sound");
      return;
    }
    createCustomReward({ title: title, cost: cost }, (success) => {
      if (!success) {
        addErrorNotification("Custom reward couldn't be created");
        return;
      }

      handleFileUpload(
        {
          fileList: fileList,
          bodySingleFileName: { bodyName: "title", value: title },
        },
        "alertSound"
      );
      setFileList(null);
      addSuccessNotification("Custom reward created successfully");
    });

    getCustomRewards();
  }, [socketContext, fileList, handleFileUpload, title, cost]);

  return (
    <Modal
      title={`${editingId ? "Edit" : "Create"} alert sound reward`}
      onClose={() => {
        dispatch(closeModal());
        dispatch(setEditingAlertSound(""));
      }}
      onSubmit={() => {
        editingId ? emitEditAlertSoundReward() : emitCreateAlertSoundReward();
      }}
      show={isModalOpen}
    >
      <div className="alert-sound-reward-modal">
        <div>
          <div>Reward title</div>
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => dispatch(setTitle(e.target.value))}
            />
          </div>
        </div>
        <div>
          <div>Reward cost</div>
          <div>
            <input
              type="number"
              value={cost}
              onChange={(e) => dispatch(setCost(e.target.valueAsNumber))}
            />
          </div>
        </div>
        <div>
          <div>Alert sound mp3</div>
          <div>
            <input
              type="file"
              name="file"
              onChange={(e) => {
                setFileList(e.target.files);
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
