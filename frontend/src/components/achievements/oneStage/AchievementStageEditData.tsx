import Modal from "@components/modal";
import { StageDataRarity, useGetAchievementStagesSounds } from "@services";
import { useState } from "react";
import { viteBackendUrl } from "@configs/envVariables";
import AvailableAchievementSounds from "./AvailableAchievementSounds";
import { TableDataWrapper } from "@components/tableWrapper";
import { Error, Loading } from "@components/axiosHelper";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import {
  removeStageDataByIndex,
  updateStageDataPropertyByIndex,
} from "@redux/stagesSlice";
import { closeSoundModal, openSoundModal } from "@redux/stagesSlice";
import { TimeGoalInput } from "./TimeGoalInput";

interface AchievementStageEditDataProps {
  onClickBadge: (indexOfStage: number) => void;
}

export default function AchievementStageEditData({
  onClickBadge,
}: AchievementStageEditDataProps) {
  const { isSoundModalOpen, isGoalTime, stage } = useSelector(
    (root: RootStore) => root.stages
  );

  const [currentChoosenStageIndex, setCurrentChoosenStageIndex] = useState(-1);

  const dispatch = useDispatch();

  const {
    data: stagesSoundResponseData,
    isLoading,
    error,
    refetch: refetchAchievementStagesSounds,
  } = useGetAchievementStagesSounds();

  const handleOnClickRemoveStage = (index: number) => {
    dispatch(removeStageDataByIndex(index));
  };

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!stagesSoundResponseData) return null;

  return (
    <>
      {stage.stageData.map((data, index) => (
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
            <TableDataWrapper>
              <div> Name</div>
              <div>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) =>
                    dispatch(
                      updateStageDataPropertyByIndex({
                        index,
                        keyName: "name",
                        value: e.target.value,
                      })
                    )
                  }
                />
              </div>
              <div>Stage </div>
              <div>{data.stage}</div>
              <div>Rarity</div>
              <div>
                <input
                  type="number"
                  min={1}
                  max={9}
                  value={data.rarity}
                  onChange={(e) => {
                    let value: StageDataRarity = e.target
                      .valueAsNumber as StageDataRarity;

                    if (value <= 0 || isNaN(value)) value = 1;
                    else if (value > 9) value = 9;
                    dispatch(
                      updateStageDataPropertyByIndex({
                        index,
                        keyName: "rarity",
                        value,
                      })
                    );
                  }}
                />
              </div>
            </TableDataWrapper>
          </td>
          <td className="stage-data-goal">
            {isGoalTime ? (
              <TableDataWrapper>
                <TimeGoalInput
                  goal={data.goal}
                  onChangeCallback={(value) =>
                    dispatch(
                      updateStageDataPropertyByIndex({
                        index,
                        keyName: "goal",
                        value,
                      })
                    )
                  }
                />
              </TableDataWrapper>
            ) : (
              <input
                type="number"
                value={data.goal}
                onChange={(e) =>
                  dispatch(
                    updateStageDataPropertyByIndex({
                      index,
                      keyName: "goal",
                      value: e.target.valueAsNumber,
                    })
                  )
                }
              />
            )}
          </td>
          <td className="stage-data-number">
            <input
              type="number"
              min={1}
              value={data.showTimeMs / 1000}
              onChange={(e) => {
                let value = e.target.valueAsNumber;
                if (value < 1 || isNaN(value)) value = 1;

                dispatch(
                  updateStageDataPropertyByIndex({
                    index,
                    keyName: "showTimeMs",
                    value: value * 1000,
                  })
                );
              }}
            />
          </td>
          <td className="stage-data-badge">
            <img
              src={`${viteBackendUrl}/${data.badge.imagesUrls.x128}`}
              alt={data.badge.name}
              onClick={() => onClickBadge(index)}
            />
          </td>
          <td className="stage-data-sound-wrapper">
            <div
              onClick={() => {
                setCurrentChoosenStageIndex(index);
                dispatch(openSoundModal());
              }}
            >
              {data.sound}
            </div>
          </td>
        </tr>
      ))}
      <Modal
        title={`Edit stage: ${
          stage.stageData.at(currentChoosenStageIndex)?.name
        }`}
        onClose={() => dispatch(closeSoundModal())}
        show={isSoundModalOpen}
      >
        <AvailableAchievementSounds
          className="achievement-stage-edit-sound"
          soundPaths={stagesSoundResponseData.data}
          onClickRefresh={refetchAchievementStagesSounds}
          onClickSound={({ basePath, soundName }) => {
            dispatch(
              updateStageDataPropertyByIndex({
                index: currentChoosenStageIndex,
                keyName: "sound",
                value: `${basePath}\\${soundName}`,
              })
            );
          }}
          currentSoundPath={stage.stageData.at(currentChoosenStageIndex)?.sound}
        />
      </Modal>
    </>
  );
}
