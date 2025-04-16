import Modal from "@components/modal";
import PreviousPage from "@components/previousPage";
import {
  useDeleteAchievementStageSound,
  useGetAchievementStagesSounds,
  useGetAchievementStagesSoundsBasePath,
} from "@services";
import { useState } from "react";
import AvailableAchievementSounds from "./AvailableAchievementSounds";
import { viteBackendUrl } from "@configs/envVariables";
import { Error, Loading } from "@components/axiosHelper";
import { useAxiosWithConfirmation } from "@hooks";

export default function AchievementStagesSounds() {
  const [showModal, setShowModal] = useState(false);
  const [choosenSound, setChoosenSound] = useState("");

  const {
    data: stagesSoundResponseData,
    isLoading,
    error,
    refetch,
  } = useGetAchievementStagesSounds();

  const { data: basePathData } = useGetAchievementStagesSoundsBasePath();

  const setSoundNameToDelete = useAxiosWithConfirmation({
    hookToProceed: useDeleteAchievementStageSound,
    opts: { onFullfiled: refetch },
  });

  const handleOnClickSoundName = (url: string) => {
    setChoosenSound(url);
    setShowModal(true);
  };

  const handleOnHideModal = () => {
    setChoosenSound("");
    setShowModal(false);
  };

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!stagesSoundResponseData) return null;

  return (
    <>
      <PreviousPage />
      <AvailableAchievementSounds
        soundPaths={stagesSoundResponseData.data}
        onClickRefresh={refetch}
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
