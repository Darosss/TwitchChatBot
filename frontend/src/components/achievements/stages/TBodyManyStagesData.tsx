import { DateTooltip } from "@components/dateTooltip";
import { AchievementStage, useDeleteAchievementStage } from "@services";
import { Link } from "react-router-dom";

interface TBodyManyStagesDataProps {
  data: AchievementStage[];
}

export default function TBodyManyStagesData({
  data,
}: TBodyManyStagesDataProps) {
  const deleteAchievementStageMutation = useDeleteAchievementStage();

  const handleDeleteStage = (id: string) => {
    if (!window.confirm(`Are you sure you want to stage with ID: ${id}?`))
      return;
    deleteAchievementStageMutation.mutate(id);
  };

  return (
    <>
      {data.map((stage) => (
        <TBodyStageData
          key={stage._id}
          stage={stage}
          onClickDelete={(stageId) => handleDeleteStage(stageId)}
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
