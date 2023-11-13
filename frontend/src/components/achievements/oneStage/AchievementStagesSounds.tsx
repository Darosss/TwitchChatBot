import Modal from "@components/modal";
import PreviousPage from "@components/previousPage";
import {
  useDeleteAchievementStageSound,
  useGetAchievementStageSounds,
  useGetAchievementStageSoundsBasePath,
} from "@services";
import { addNotification, handleActionOnChangeState } from "@utils";
import { useEffect, useState } from "react";
import AvailableAchievementSounds from "./AvailableAchievementSounds";
import { viteBackendUrl } from "src/configs/envVariables";

export default function AchievementStagesSounds() {
  const [showModal, setShowModal] = useState(false);
  const [soundNameToDelete, setSoundNameToDelete] = useState<string | null>(
    null
  );

  const [choosenSound, setChoosenSound] = useState<string | null>(null);

  const { refetchData: fetchDeleteSound } = useDeleteAchievementStageSound(
    soundNameToDelete || ""
  );
  const {
    data: stagesSoundResponseData,
    loading,
    error,
    refetchData,
  } = useGetAchievementStageSounds();

  const { data: basePathData } = useGetAchievementStageSoundsBasePath();

  useEffect(() => {
    handleActionOnChangeState(soundNameToDelete, setSoundNameToDelete, () => {
      fetchDeleteSound()
        .then((data) => {
          setSoundNameToDelete(null);
          refetchData();
          addNotification("Deleted", data.message, "danger");
        })
        .catch((err) =>
          addNotification(
            "Deleted",
            `Achievement stage sound cannot be deleted. ${err.response?.data?.message}`,
            "danger"
          )
        );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundNameToDelete]);

  const handleOnClickSoundName = (url: string) => {
    setChoosenSound(url);
    setShowModal(true);
  };

  const handleOnHideModal = () => {
    setChoosenSound(null);
    setShowModal(false);
  };

  if (loading) return <>Loading</>;
  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!stagesSoundResponseData) return null;

  return (
    <>
      <PreviousPage />
      <AvailableAchievementSounds
        soundPaths={stagesSoundResponseData.data}
        onClickRefresh={refetchData}
        onClickSound={({ soundName }) => {
          handleOnClickSoundName(soundName);
        }}
      />

      <Modal
        title={`Achievement stage sound ${choosenSound}`}
        onClose={handleOnHideModal}
        show={showModal}
      >
        <div className="sound-images-modal-content">
          {basePathData ? (
            <audio
              src={`${viteBackendUrl}\\${basePathData.data}\\${choosenSound}`}
              controls
            />
          ) : null}
          <div>
            Rename sound: soon(for now you need to delete and upload again)
          </div>
          <div>
            Replace sound: soon(for now you need to delete and upload again)
          </div>
          <button
            className="danger-button common-button"
            onClick={() => setSoundNameToDelete(choosenSound)}
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
