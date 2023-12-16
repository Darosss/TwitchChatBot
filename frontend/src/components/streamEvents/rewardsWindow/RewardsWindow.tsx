import React, { useCallback, useEffect, useState } from "react";
import "react-notifications-component/dist/theme.css";

import Modal from "@components/modal";
import { CustomRewardData, useSocketContext } from "@socket";
import { useAxiosWithConfirmation, useFileUpload } from "@hooks";
import { useGetAlertSoundsMp3Names, useDeleteAlertSound } from "@services";
import { addErrorNotification, addSuccessNotification } from "@utils";

export default function MessagesWindow() {
  const socketContext = useSocketContext();
  const [showModal, setShowModal] = useState(false);
  const [alertSounds, setAlertSounds] = useState<CustomRewardData[]>();

  const [title, setTitle] = useState("");
  const [cost, setCost] = useState(1);
  const [fileList, setFileList] = useState<FileList | null>(null);

  const [editingAlertSound, setEditingAlertSound] = useState("");

  const [alertSoundsServer, setAlertSoundsServer] = useState([""]);
  const { handleFileUpload } = useFileUpload(`files/upload/alertSounds`);

  const { data: mp3AlertSounds, refetchData: refetchMp3AlertSounds } =
    useGetAlertSoundsMp3Names();

  const setAlertSoundNameDelete = useAxiosWithConfirmation({
    hookToProceed: useDeleteAlertSound,
    opts: {
      onFullfiled: () => refetchMp3AlertSounds(),
      showConfirmation: false,
    },
  });

  useEffect(() => {
    if (!mp3AlertSounds) return;
    setAlertSoundsServer(mp3AlertSounds.data);
  }, [mp3AlertSounds]);

  useEffect(() => {
    const {
      emits: { getCustomRewards: emitGetCustomRewards },
      events: { getCustomRewards },
    } = socketContext;
    getCustomRewards.on((rewards) => {
      setAlertSounds(rewards);
    });

    emitGetCustomRewards();

    return () => {
      getCustomRewards.off();
    };
  }, [socketContext]);

  const emitRemoveAlertSoundReward = useCallback(
    (id: string, name: string) => {
      const {
        emits: { deleteCustomReward, getCustomRewards },
      } = socketContext;
      if (!window.confirm("Are you sure to delete custom reward?")) return;
      deleteCustomReward(id, (succes) => {
        if (!succes) {
          addErrorNotification("Custom reward couldn't be removed");
          return;
        }
        setAlertSoundNameDelete(name);
        getCustomRewards();
        addSuccessNotification("Custom reward removed successfully");
      });
    },
    [socketContext, setAlertSoundNameDelete]
  );

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

      addSuccessNotification("Custom reward created successfully");
    });

    getCustomRewards();
  }, [socketContext, cost, fileList, handleFileUpload, title]);

  const emitEditAlertSoundReward = useCallback(() => {
    const {
      emits: { updateCustomReward },
    } = socketContext;
    if (fileList && fileList.length <= 0) {
      addErrorNotification("You must add sound file to update alert sound");
      return;
    }
    updateCustomReward(
      editingAlertSound,
      { title: title, cost: cost },
      (success) => {
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

        addSuccessNotification("Custom reward created successfully");
      }
    );
  }, [
    socketContext,
    cost,
    editingAlertSound,
    fileList,
    handleFileUpload,
    title,
  ]);

  const onSubmitModalCreate = () => {
    emitCreateAlertSoundReward();
    setShowModal(false);
  };

  const onSubmitModalEdit = () => {
    //TODO: add rename file name mp3 alert sound
    emitEditAlertSoundReward();
    handleOnHideModal();
  };

  const handleOnShowEditModal = (reward: CustomRewardData) => {
    setEditingAlertSound(reward.id);
    setTitle(reward.title);
    setCost(reward.cost);

    setShowModal(true);
  };

  const handleOnShowCreateModal = () => {
    setTitle("");
    setCost(1);
    setFileList(null);

    setShowModal(true);
  };

  const handleOnHideModal = () => {
    setShowModal(false);
    setEditingAlertSound("");
  };

  const isAlertSoundMp3OnServer = (rewardTitle: string) => {
    return alertSoundsServer.some((snd) => snd.includes(rewardTitle));
  };

  return (
    <>
      <div className="widget-header"> Stream alert sounds </div>
      <div className="custom-rewards-window">
        <div>
          <button
            onClick={() => handleOnShowCreateModal()}
            className="common-button primary-button"
          >
            New alert sound
          </button>
        </div>
        {alertSounds?.map((reward, index) => (
          <div
            key={index}
            style={{
              background: `${
                isAlertSoundMp3OnServer(reward.title) ? "green" : "red"
              }`,
            }}
          >
            <div>{reward.title}</div>
            <div>{reward.cost}</div>
            <div>
              <button
                onClick={() => {
                  handleOnShowEditModal(reward);
                }}
                className="common-button primary-button"
              >
                Edit
              </button>
            </div>
            <div>
              <button
                onClick={() =>
                  emitRemoveAlertSoundReward(reward.id, reward.title)
                }
                className="common-button danger-button"
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={`${editingAlertSound ? "Edit" : "Create"} alert sound reward`}
        onClose={() => handleOnHideModal()}
        onSubmit={() => {
          editingAlertSound ? onSubmitModalEdit() : onSubmitModalCreate();
        }}
        show={showModal}
      >
        <div className="alert-sound-reward-modal">
          <div>
            <div>Reward title</div>
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div>Reward cost</div>
            <div>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.valueAsNumber)}
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
    </>
  );
}
