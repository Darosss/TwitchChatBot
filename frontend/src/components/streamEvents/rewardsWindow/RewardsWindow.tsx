import React, { useCallback, useEffect, useState } from "react";
import "react-notifications-component/dist/theme.css";

import Modal from "@components/modal";
import { CustomRewardData, useSocketContext } from "@context/socket";
import { addNotification } from "@utils/getNotificationValues";
import useFileUpload from "@hooks/useFileUpload";
import { useGetAlertSoundsMp3Names } from "@services/FilesService";
import { useDeleteAlertSound } from "@services/FilesService";
import { handleActionOnChangeState } from "@utils/handleDeleteApi";

export default function MessagesWindow() {
  const socketContext = useSocketContext();
  const [showModal, setShowModal] = useState(false);
  const [alertSounds, setAlertSounds] = useState<CustomRewardData[]>();

  const [title, setTitle] = useState("");
  const [cost, setCost] = useState(1);
  const [fileList, setFileList] = useState<FileList | null>(null);

  const [editingAlertSound, setEditingAlertSound] = useState("");

  const [alertSoundsServer, setAlertSoundsServer] = useState([""]);
  const [alertSoundNameDelete, setAlertSoundNameDelete] = useState<
    string | null
  >(null);
  const { handleFileUpload } = useFileUpload(`files/upload/alertSounds`);

  const { data: mp3AlertSounds, refetchData: refetchMp3AlertSounds } =
    useGetAlertSoundsMp3Names();

  const { refetchData: refetchDeleteAlertSound } = useDeleteAlertSound(
    alertSoundNameDelete || ""
  );

  useEffect(() => {
    handleActionOnChangeState(
      alertSoundNameDelete,
      setAlertSoundNameDelete,
      () => {
        refetchDeleteAlertSound().then(() => {
          refetchMp3AlertSounds();
          addNotification(
            "Deleted",
            "Alert sound from server deleted successfully",
            "danger"
          );
          setAlertSoundNameDelete(null);
        });
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertSoundNameDelete]);

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
      if (window.confirm(`Are you sure to delete custom reward: ${name}`)) {
        deleteCustomReward(id, (succes) => {
          if (!succes) {
            addNotification(
              "Can't remove",
              "Custom reward couldn't be removed",
              "danger"
            );
            return;
          }

          addNotification(
            "Removed",
            "Custom reward removed successfully",
            "success"
          );

          setAlertSoundNameDelete(name);
        });

        getCustomRewards();
      }
    },
    [socketContext]
  );

  const emitCreateAlertSoundReward = useCallback(() => {
    if (!title || !fileList) return;
    const {
      emits: { getCustomRewards, createCustomReward },
    } = socketContext;
    if (fileList && fileList.length <= 0) {
      addNotification(
        "No sound",
        "You must add sound file to create alert sound",
        "danger"
      );
      return;
    }
    createCustomReward({ title: title, cost: cost }, (success) => {
      if (!success) {
        addNotification("Error", "Custom reward couldn't be created", "danger");
        return;
      }

      handleFileUpload(
        {
          fileList: fileList,
          bodySingleFileName: { bodyName: "title", value: title },
        },
        "alertSound"
      );

      addNotification(
        "Success",
        "Custom reward created successfully",
        "success"
      );
    });

    getCustomRewards();
  }, [socketContext, cost, fileList, handleFileUpload, title]);

  const emitEditAlertSoundReward = useCallback(() => {
    const {
      emits: { updateCustomReward },
    } = socketContext;
    if (fileList && fileList.length <= 0) {
      addNotification(
        "No sound",
        "You must add sound file to update alert sound",
        "danger"
      );
      return;
    }
    updateCustomReward(
      editingAlertSound,
      { title: title, cost: cost },
      (success) => {
        if (!success) {
          addNotification(
            "Error",
            "Custom reward couldn't be created",
            "danger"
          );
          return;
        }

        handleFileUpload(
          {
            fileList: fileList,
            bodySingleFileName: { bodyName: "title", value: title },
          },
          "alertSound"
        );

        addNotification(
          "Success",
          "Custom reward created successfully",
          "success"
        );
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
                onClick={() => {
                  emitRemoveAlertSoundReward(reward.id, reward.title);
                }}
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
