import Modal from "@components/modal";
import PreviousPage from "@components/previousPage";
import {
  useDeleteAchievementStageSound,
  useGetAchievementStageSounds,
  useGetAchievementStageSoundsBasePath,
} from "@services";
import { useState } from "react";
import AvailableAchievementSounds from "./AvailableAchievementSounds";
import { viteBackendUrl } from "src/configs/envVariables";
import { AxiosError, Loading } from "@components/axiosHelper";
import { useAxiosWithConfirmation } from "@hooks";

export default function AchievementStagesSounds() {
  const [showModal, setShowModal] = useState(false);
  const [choosenSound, setChoosenSound] = useState("");

  const {
    data: stagesSoundResponseData,
    loading,
    error,
    refetchData,
  } = useGetAchievementStageSounds();

  const { data: basePathData } = useGetAchievementStageSoundsBasePath();

  const setSoundNameToDelete = useAxiosWithConfirmation({
    hookToProceed: useDeleteAchievementStageSound,
    opts: { onFullfiled: () => refetchData() },
  });

  const handleOnClickSoundName = (url: string) => {
    setChoosenSound(url);
    setShowModal(true);
  };

  const handleOnHideModal = () => {
    setChoosenSound("");
    setShowModal(false);
  };

  if (loading) return <Loading />;
  if (error) return <AxiosError error={error} />;
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
