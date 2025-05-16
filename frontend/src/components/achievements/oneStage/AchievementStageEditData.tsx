import Modal from "@components/modal";
import { StageDataRarity, useGetAchievementStagesSounds } from "@services";
import { useCallback, useState } from "react";
import { viteBackendUrl } from "@configs/envVariables";
import AvailableAchievementSounds from "./AvailableAchievementSounds";
import moment from "moment";
import { TableDataWrapper } from "@components/tableWrapper";
import { getDateFromSecondsToYMDHMS } from "@utils";
import { Error, Loading } from "@components/axiosHelper";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import {
  removeStageDataByIndex,
  updateStageDataPropertyByIndex,
} from "@redux/stagesSlice";
import { closeSoundModal, openSoundModal } from "@redux/stagesSlice";

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

interface TimeGoalInputProps {
  goal: number;
  onChangeCallback: (value: number) => void;
}
enum CurrentInputEnum {
  SECONDS = "Seconds",
  MINUTES = "Minutes",
  HOURS = "Hours",
  DAYS = "Days",
  MONTHS = "Months",
  YEARS = "Years",
}

function TimeGoalInput({ goal, onChangeCallback }: TimeGoalInputProps) {
  const [currentInput, setCurrentInput] = useState<CurrentInputEnum>(
    CurrentInputEnum.MINUTES
  );
  const [localGoalValue, setLocalGoalValue] = useState(goal);
  const onChangeFn = useCallback(
    (value: number) => {
      let time: moment.Moment | null = null;
      switch (currentInput) {
        case CurrentInputEnum.MINUTES:
          time = moment().add(value, "minute");
          break;
        case CurrentInputEnum.HOURS:
          time = moment().add(value, "hour");
          break;
        case CurrentInputEnum.DAYS:
          time = moment().add(value, "day");
          break;
        case CurrentInputEnum.MONTHS:
          time = moment().add(value, "month");
          break;
        case CurrentInputEnum.YEARS:
          time = moment().add(value, "year");
          break;
        default:
        case CurrentInputEnum.SECONDS:
          break;
      }

      return time ? Math.round(time.diff(moment()) / 1000) : value;
    },
    [currentInput]
  );
  return (
    <>
      <div>Time in</div>
      <div>
        <select
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value as CurrentInputEnum)}
        >
          <option id={`${CurrentInputEnum.SECONDS}`}>
            {CurrentInputEnum.SECONDS}
          </option>
          <option id={`${CurrentInputEnum.MINUTES}`}>
            {CurrentInputEnum.MINUTES}
          </option>
          <option id={`${CurrentInputEnum.HOURS}`}>
            {CurrentInputEnum.HOURS}
          </option>
          <option id={`${CurrentInputEnum.DAYS}`}>
            {CurrentInputEnum.DAYS}
          </option>
          <option id={`${CurrentInputEnum.MONTHS}`}>
            {CurrentInputEnum.MONTHS}
          </option>
          <option id={`${CurrentInputEnum.YEARS}`}>
            {CurrentInputEnum.YEARS}
          </option>
        </select>
      </div>
      <div>Goal</div>
      <div>
        <input
          type="number"
          onChange={(e) => setLocalGoalValue(e.target.valueAsNumber)} //onChangeCallback(onChangeFn(e.target.valueAsNumber))}
          onBlur={() => onChangeCallback(onChangeFn(localGoalValue))}
          value={localGoalValue}
        />
      </div>
      <div>Preview</div>

      <div>{getDateFromSecondsToYMDHMS(onChangeFn(localGoalValue))}</div>
    </>
  );
}

//
