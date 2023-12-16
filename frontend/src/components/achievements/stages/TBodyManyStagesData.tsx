import { DateTooltip } from "@components/dateTooltip";
import { useDeleteAchievementStage, AchievementStage } from "@services";
import { Link } from "react-router-dom";
import { useManyAchievementStagesContext } from "./ManyAchievementStagesContext";
import { useAxiosWithConfirmation } from "@hooks";

export default function TBodyManyStagesData() {
  const {
    achievementStagesState: { data },
    refetchStages,
  } = useManyAchievementStagesContext();

  const setAchievementStageIdToDelete = useAxiosWithConfirmation({
    hookToProceed: useDeleteAchievementStage,
    opts: { onFullfiled: () => refetchStages() },
  });

  return (
    <>
      {data.map((stage) => (
        <TBodyStageData
          key={stage._id}
          stage={stage}
          onClickDelete={(stageId) => setAchievementStageIdToDelete(stageId)}
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
