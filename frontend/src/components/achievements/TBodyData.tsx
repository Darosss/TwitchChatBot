import { DateTooltip } from "@components/dateTooltip";
import { TableDataWrapper } from "@components/tableWrapper";
import { addNotification, generateEnabledDisabledDiv } from "@utils";
import { useAchievementsListContext } from "./AchievementsContext";
import { Achievement, useDeleteCustomAchievement } from "@services";
import { useManageAchievementContext } from "./ManageAchievementContext";
import { ManageAchievementsCurrentAction } from "./types";

export default function TBodyData() {
  const {
    achievementsState: { data },
  } = useAchievementsListContext();

  return (
    <>
      {data.map((achievement, index) => {
        return (
          <tr key={index} className="achievements-list-data-tbody">
            <td>
              {achievement.custom ? (
                <div>Custom achievement</div>
              ) : (
                <div>Default achievement</div>
              )}
              <EditAchievementButton achievement={achievement} />
              {achievement.custom ? (
                <DeleteCustomAchievementButton
                  achievementId={achievement._id}
                  achievementName={achievement.name}
                />
              ) : null}
            </td>
            <td>
              <TableDataWrapper>
                <div>Name </div>
                <div>{achievement.name}</div>
                <div>Enabled</div>
                {generateEnabledDisabledDiv(
                  achievement.enabled,
                  achievement.enabled.toString().toUpperCase()
                )}
                <div>Is time</div>
                {generateEnabledDisabledDiv(
                  achievement.isTime,
                  achievement.isTime.toString().toUpperCase()
                )}
              </TableDataWrapper>
            </td>

            <td>
              <TableDataWrapper>
                <div>Stages </div>
                <div>{achievement.stages.name}</div>
                <div>Tag</div>
                {generateEnabledDisabledDiv(
                  achievement.tag.enabled,
                  achievement.tag.name
                )}
                {achievement.hidden ? (
                  <>
                    <div>Hidden</div>
                    {generateEnabledDisabledDiv(
                      achievement.hidden,
                      String(achievement.hidden).toUpperCase() || "FALSE"
                    )}{" "}
                  </>
                ) : null}
                {achievement.custom ? (
                  <>
                    <div>Custom action</div>
                    <div>{achievement.custom.action}</div>
                    <div>Case sensitive?</div>
                    {generateEnabledDisabledDiv(
                      achievement.custom.caseSensitive || false,
                      achievement.custom.caseSensitive
                        ?.toString()
                        .toUpperCase() || "FALSE"
                    )}
                  </>
                ) : null}
              </TableDataWrapper>
            </td>
            <td>
              <DateTooltip date={achievement.createdAt} />
              <DateTooltip date={achievement.updatedAt} />
            </td>
          </tr>
        );
      })}
    </>
  );
}
interface DeleteCustomAchievementButtonProps {
  achievementId: string;
  achievementName: string;
}

function DeleteCustomAchievementButton({
  achievementId,
  achievementName,
}: DeleteCustomAchievementButtonProps) {
  const { refetchAchievements } = useAchievementsListContext();
  const { refetchData: fetchDeleteCustomAchievement } =
    useDeleteCustomAchievement(achievementId);

  const handleOnClickDelete = () => {
    if (window.confirm(`Are you sure you want to delete: ${achievementName}`)) {
      fetchDeleteCustomAchievement()
        .then(() => {
          refetchAchievements();
          addNotification(
            "Deleted",
            "Custom achievement deleted successfully",
            "danger"
          );
        })
        .catch((err) =>
          addNotification(
            "Deleted",
            `Custom achievement cannot be deleted. ${err.response?.data?.message}`,
            "danger"
          )
        );
    }
  };

  return (
    <button
      className="common-button danger-button"
      onClick={handleOnClickDelete}
    >
      Delete
    </button>
  );
}

interface EditAchievementButtonProps {
  achievement: Achievement;
}

function EditAchievementButton({ achievement }: EditAchievementButtonProps) {
  const {
    achievementState: [, dispatch],
    showModalState: [, setShowModal],
    setCurrentAction,
  } = useManageAchievementContext();
  return (
    <button
      className="common-button primary-button"
      onClick={() => {
        setCurrentAction(
          achievement.custom
            ? ManageAchievementsCurrentAction.EDIT_CUSTOM
            : ManageAchievementsCurrentAction.EDIT
        );
        dispatch({ type: "SET_STATE", payload: achievement });
        setShowModal(true);
      }}
    >
      Edit
    </button>
  );
}
