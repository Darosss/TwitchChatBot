import Modal from "@components/modal";
import { AchievementStageData, useGetAchievementStageSounds } from "@services";
import { useState } from "react";
import { viteBackendUrl } from "src/configs/envVariables";
import AvailableAchievementSounds from "./AvailableAchievementSounds";
import { useAchievementStageContext } from "./Context";

interface AchievementStageEditDataProps {
  onClickBadge: (indexOfStage: number) => void;
}

export default function AchievementStageEditData({
  onClickBadge,
}: AchievementStageEditDataProps) {
  const {
    achievementStageState: [state, dispatch],
    updateStageDataByIndex,
  } = useAchievementStageContext();
  const [showModal, setShowModal] = useState(false);
  const [currentChoosenStageIndex, setCurrentChoosenStageIndex] = useState(-1);

  const {
    data: stagesSoundResponseData,
    loading,
    error,
    refetchData,
  } = useGetAchievementStageSounds();

  const handleOnClickRemoveStage = (index: number) => {
    const { stageData } = state;
    if (index === stageData.length) return;
    stageData.splice(index, 1);

    const newStageData = stageData.map((data, stageDataIndex) => {
      if (stageDataIndex >= index) return { ...data, stage: data.stage - 1 };

      return data;
    });

    dispatch({ type: "SET_STAGE_DATA", payload: newStageData });
  };

  const updateStageDataKeyByIndex = (
    index: number,
    key: keyof AchievementStageData,
    value: number | string
  ) => {
    updateStageDataByIndex(index, {
      ...state.stageData[index],
      [key]: value,
    });
  };

  if (loading) return <>Loading</>;
  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!stagesSoundResponseData) return null;

  return (
    <>
      {state.stageData.map((data, index) => (
        <tr key={index} className="stage-data-content stage-data-edit">
          <td className="stage-data-content-nr-delete-td">
            {index + 1}
            <button
              className="danger-button common-button"
              onClick={() => handleOnClickRemoveStage(index)}
            >
              X
            </button>
          </td>
          <td>
            <input
              type="text"
              value={data.name}
              onChange={(e) =>
                updateStageDataKeyByIndex(index, "name", e.target.value)
              }
            />
          </td>
          <td className="stage-data-number">{data.stage}</td>
          <td className="stage-data-badge">
            <img
              src={`${viteBackendUrl}/${data.badge.imageUrl}`}
              alt={data.badge.name}
              onClick={() => onClickBadge(index)}
            />
          </td>
          <td className="stage-data-number">
            <input
              type="number"
              min={1}
              max={10}
              value={data.rarity}
              onChange={(e) => {
                let value = e.target.valueAsNumber;
                if (value <= 0 || isNaN(value)) value = 1;
                else if (value > 10) value = 10;

                updateStageDataKeyByIndex(index, "rarity", value);
              }}
            />
          </td>
          <td className="stage-data-number">
            <input
              type="number"
              value={data.goal}
              onChange={(e) =>
                updateStageDataKeyByIndex(index, "goal", e.target.valueAsNumber)
              }
            />
          </td>
          <td className="stage-data-number">
            <input
              type="number"
              min={1}
              value={data.showTimeMs / 1000}
              onChange={(e) => {
                let value = e.target.valueAsNumber;
                if (value < 1 || isNaN(value)) value = 1;
                updateStageDataKeyByIndex(index, "showTimeMs", value * 1000);
              }}
            />
          </td>

          <td className="stage-data-sound-wrapper">
            <div
              onClick={() => {
                setCurrentChoosenStageIndex(index);
                setShowModal(true);
              }}
            >
              {data.sound}
            </div>
          </td>
        </tr>
      ))}
      <Modal
        title={`Edit stage: ${
          state.stageData.at(currentChoosenStageIndex)?.name
        }`}
        onClose={() => setShowModal(false)}
        show={showModal}
      >
        <AvailableAchievementSounds
          className="achievement-stage-edit-sound"
          soundPaths={stagesSoundResponseData.data}
          onClickRefresh={refetchData}
          onClickSound={({ basePath, soundName }) => {
            updateStageDataKeyByIndex(
              currentChoosenStageIndex,
              "sound",
              `${basePath}\\${soundName}`
            );
          }}
          currentSoundPath={state.stageData.at(currentChoosenStageIndex)?.sound}
        />
      </Modal>
    </>
  );
}
