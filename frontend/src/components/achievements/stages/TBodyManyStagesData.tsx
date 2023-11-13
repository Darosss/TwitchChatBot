import { DateTooltip } from "@components/dateTooltip";
import { useDeleteAchievementStage, AchievementStage } from "@services";
import { handleActionOnChangeState, addNotification } from "@utils";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useManyAchievementStagesContext } from "./ManyAchievementStagesContext";

export default function TBodyManyStagesData() {
  const {
    achievementStagesState: { data },
    refetchStages,
  } = useManyAchievementStagesContext();

  const [stageIdToDelete, setStageIdToDelete] = useState<string | null>(null);
  const { refetchData: fetchDeleteStage } = useDeleteAchievementStage(
    stageIdToDelete || ""
  );
  useEffect(() => {
    handleActionOnChangeState(stageIdToDelete, setStageIdToDelete, () => {
      fetchDeleteStage()
        .then(() => {
          refetchStages();
          addNotification(
            "Deleted",
            "Achievement stage deleted successfully",
            "danger"
          );
        })
        .catch((err) =>
          addNotification(
            "Deleted",
            `Achievement stage cannot be deleted. ${err.response?.data?.message}`,
            "danger"
          )
        )
        .finally(() => setStageIdToDelete(null));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageIdToDelete]);
  return (
    <>
      {data.map((stage) => (
        <TBodyStageData
          key={stage._id}
          stage={stage}
          onClickDelete={(stageId) => setStageIdToDelete(stageId)}
        />
      ))}
    </>
  );
}
interface TBodyStageDataProps {
  stage: AchievementStage;
  onClickDelete: (stageId: string) => void;
}
function TBodyStageData({ stage, onClickDelete }: TBodyStageDataProps) {
  return (
    <tr className="stages-list-data-tbody">
      <td>
        <div className="stage-data-table-actions">
          <Link
            to={`${stage._id}`}
            className="common-button primary-button"
            onClick={(e) => {
              e.stopPropagation();
              // handleOnShowEditModal(stage);
            }}
          >
            Show
          </Link>
          <button
            className="common-button danger-button"
            onClick={(e) => {
              e.stopPropagation();
              onClickDelete(stage._id);
            }}
          >
            Delete
          </button>
        </div>
      </td>
      <td>{stage.name}</td>
      <td>
        <DateTooltip date={stage.createdAt} />
      </td>
      <td>
        <DateTooltip date={stage.updatedAt} />
      </td>
    </tr>
  );
}
