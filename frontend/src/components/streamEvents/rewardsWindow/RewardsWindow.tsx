import React, { useContext, useEffect, useState } from "react";
import "react-notifications-component/dist/theme.css";

import Modal from "@components/modal";
import { SocketContext, CustomRewardData } from "@context/socket";
import { addNotification } from "@utils/getNotificationValues";
import useFileUpload from "@hooks/useFileUpload";
import { getAlertSoundsMp3Names } from "@services/FilesService";
import { deleteAlertSound } from "@services/FilesService";
import { handleActionOnChangeState } from "@utils/handleDeleteApi";

export default function MessagesWindow() {
  const socket = useContext(SocketContext);
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
  const { uploadProgress, handleFileUpload, error, success } = useFileUpload(
    `files/upload/alertSounds`
  );

  const { data: mp3AlertSounds, refetchData: refetchMp3AlertSounds } =
    getAlertSoundsMp3Names();

  const { data: delAlertSoundData, refetchData: refetchDeleteAlertSound } =
    deleteAlertSound(alertSoundNameDelete || "");

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
  }, [alertSoundNameDelete]);

  useEffect(() => {
    if (!mp3AlertSounds) return;
    setAlertSoundsServer(mp3AlertSounds.data);
  }, [mp3AlertSounds]);

  useEffect(() => {
    socket.on("getCustomRewards", (rewards) => {
      setAlertSounds(rewards);
    });

    socket.emit("getCustomRewards");

    return () => {
      socket.off("getCustomRewards");
    };
  }, []);

  const emitRemoveAlertSoundReward = (id: string, name: string) => {
    if (confirm(`Are you sure to delete custom reward: ${name}`)) {
      socket.emit("deleteCustomReward", id, (succes) => {
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
      socket.emit("getCustomRewards");
    }
  };

  const emitCreateAlertSoundReward = () => {
    if (fileList && fileList.length <= 0) {
      addNotification(
        "No sound",
        "You must add sound file to create alert sound",
        "danger"
      );
      return;
    }
    socket.emit(
      "createCustomReward",
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

    socket.emit("getCustomRewards");
  };

  const emitEditAlertSoundReward = () => {
    if (fileList && fileList.length <= 0) {
      addNotification(
        "No sound",
        "You must add sound file to update alert sound",
        "danger"
      );
      return;
    }
    socket.emit(
      "updateCustomReward",
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
  };

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
        {alertSounds?.map((reward, index) => {
          return (
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
          );
        })}
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
