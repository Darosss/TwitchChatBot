import Modal from "@components/modal";
import { AchievementStageData, useGetAchievementStageSounds } from "@services";
import { useCallback, useState } from "react";
import { viteBackendUrl } from "src/configs/envVariables";
import AvailableAchievementSounds from "./AvailableAchievementSounds";
import { useAchievementStageContext } from "./Context";
import moment from "moment";
import { TableDataWrapper } from "@components/tableWrapper";
import { getDateFromSecondsToYMDHMS } from "@utils";

interface AchievementStageEditDataProps {
  onClickBadge: (indexOfStage: number) => void;
}

export default function AchievementStageEditData({
  onClickBadge,
}: AchievementStageEditDataProps) {
  const {
    achievementStageState: [state, dispatch],
    updateStageDataByIndex,
    isGoalTimeState: [isGoalTime],
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
            <TableDataWrapper>
              <div> Name</div>
              <div>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) =>
                    updateStageDataKeyByIndex(index, "name", e.target.value)
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
                  max={10}
                  value={data.rarity}
                  onChange={(e) => {
                    let value = e.target.valueAsNumber;
                    if (value <= 0 || isNaN(value)) value = 1;
                    else if (value > 10) value = 10;

                    updateStageDataKeyByIndex(index, "rarity", value);
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
                    updateStageDataKeyByIndex(index, "goal", value)
                  }
                />
              </TableDataWrapper>
            ) : (
              <input
                type="number"
                value={data.goal}
                onChange={(e) =>
                  updateStageDataKeyByIndex(
                    index,
                    "goal",
                    e.target.valueAsNumber
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
                updateStageDataKeyByIndex(index, "showTimeMs", value * 1000);
              }}
            />
          </td>
          <td className="stage-data-badge">
            <img
              src={`${viteBackendUrl}/${data.badge.imageUrl}`}
              alt={data.badge.name}
              onClick={() => onClickBadge(index)}
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
