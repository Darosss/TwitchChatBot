import { useEditAchievementStage } from "@services";
import { addErrorNotification } from "@utils";
import { useParams } from "react-router-dom";
import { useAchievementStageContext } from "./Context";

interface ActionButtonsProps {
  editing: boolean;
  onCancelEdit: () => void;
  onClickEdit: () => void;
  onClickSave: () => void;
}
export default function ActionButtons({
  editing,
  onCancelEdit,
  onClickEdit,
  onClickSave,
}: ActionButtonsProps) {
  const { id } = useParams();

  const {
    achievementStageState: [state, dispatch],
    refetchAchievementStageData,
  } = useAchievementStageContext();
  const { refetchData: fetchEditAchievementStage } = useEditAchievementStage(
    id || "",
    {
      ...state,
      stageData: state.stageData.map((stageData) => ({
        ...stageData,
        badge: stageData.badge._id,
      })),
    }
  );
  const handleOnClickAddStage = () => {
    const { stageData } = state;
    const stageDataLen = stageData.length;
    const previousStageData = stageData[stageDataLen - 1];
    dispatch({
      type: "PUSH_TO_STAGE_DATA",
      payload: previousStageData
        ? {
            name: `Stage ${stageDataLen + 1}`,
            stage: stageDataLen + 1,
            goal: previousStageData.goal * 2,
            badge: previousStageData.badge,
            sound: previousStageData.sound,
            rarity: previousStageData.rarity,
            showTimeMs: previousStageData.showTimeMs,
          }
        : {
            name: "New stage",
            stage: 1,
            goal: 1,
            rarity: 1,
            badge: {
              _id: "",
              name: "",
              description: "",
              imagesUrls: { x32: "", x64: "", x96: "", x128: "" },
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            showTimeMs: 2500,
          },
    });
  };
  const handleOnClickSave = () => {
    const isBadgeSet = state.stageData.every(
      (stageData) => stageData.badge._id
    );
    if (!isBadgeSet) return addErrorNotification("Badge is not set properly");
    onClickSave();
    fetchEditAchievementStage();
    refetchAchievementStageData();
  };

  return (
    <>
      {editing ? (
        <>
          <button
            className="common-button danger-button"
            onClick={() => {
              onCancelEdit();
              refetchAchievementStageData();
            }}
          >
            Cancel edit
          </button>
          <button
            className="common-button primary-button"
            onClick={handleOnClickSave}
          >
            Save
          </button>
          <button
            className="common-button primary-button"
            onClick={handleOnClickAddStage}
          >
            Add stage
          </button>
        </>
      ) : (
        <button className="common-button primary-button" onClick={onClickEdit}>
          Edit
        </button>
      )}
    </>
  );
}
