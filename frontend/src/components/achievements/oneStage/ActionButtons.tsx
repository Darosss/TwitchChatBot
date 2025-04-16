import {
  useEditAchievementStage,
  useRefetchAchievementStageById,
} from "@services";
import { addErrorNotification } from "@utils";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import { pushToStageData } from "@redux/stagesSlice";

interface ActionButtonsProps {
  stageId: string;
  editing: boolean;
  onCancelEdit: () => void;
  onClickEdit: () => void;
  onClickSave: () => void;
}
export default function ActionButtons({
  stageId,
  editing,
  onCancelEdit,
  onClickEdit,
  onClickSave,
}: ActionButtonsProps) {
  const dispatch = useDispatch();
  const { stage } = useSelector((root: RootStore) => root.stages);
  const editAchievementStageMutation = useEditAchievementStage();
  const handleOnClickAddStage = () => {
    const { stageData } = stage;
    const stageDataLen = stageData.length;
    const previousStageData = stageData[stageDataLen - 1];

    dispatch(
      pushToStageData(
        previousStageData
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
            }
      )
    );
  };
  const refetchAchievementStageById = useRefetchAchievementStageById();

  const handleEditAchievementStage = () => {
    const { createdAt, updatedAt, stageData, ...rest } = stage;
    editAchievementStageMutation.mutate({
      id: stageId,
      updatedAchievementStage: {
        ...rest,
        stageData: stageData.map((stageData) => ({
          ...stageData,
          badge: stageData.badge._id,
        })),
      },
    });
  };

  const handleOnClickSave = () => {
    const isBadgeSet = stage.stageData.every(
      (stageData) => stageData.badge._id
    );
    if (!isBadgeSet) return addErrorNotification("Badge is not set properly");
    onClickSave();
    handleEditAchievementStage();
  };

  return (
    <>
      {editing ? (
        <>
          <button
            className="common-button danger-button"
            onClick={() => {
              onCancelEdit();
              refetchAchievementStageById(stageId);
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
