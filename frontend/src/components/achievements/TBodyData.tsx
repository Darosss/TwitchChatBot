import { DateTooltip } from "@components/dateTooltip";
import { TableDataWrapper } from "@components/tableWrapper";
import { generateEnabledDisabledDiv } from "@utils";
import { Achievement, useDeleteCustomAchievement } from "@services";
import { useDispatch } from "react-redux";
import {
  AchievementSliceType,
  ManageAchievementsCurrentAction,
  openModal,
  setAchievementState,
  setCurrentAction,
} from "@redux/achievementsSlice";

interface TBodyDataProps {
  data: Achievement[];
}

const getAchievementsStateDataHelper = (
  achievement: Achievement
): AchievementSliceType["achievement"] => {
  return {
    ...achievement,
    tag: achievement.tag._id,
    stages: achievement.stages._id,
  };
};

export default function TBodyData({ data }: TBodyDataProps) {
  const deleteCustomAchievementMutate = useDeleteCustomAchievement();

  const handleDeleteCustomAchievement = (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete: ${name}`)) return;
    deleteCustomAchievementMutate.mutate(id);
  };

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
                <button
                  className="common-button danger-button"
                  onClick={() =>
                    handleDeleteCustomAchievement(
                      achievement._id,
                      achievement.name
                    )
                  }
                >
                  Delete
                </button>
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
                    )}
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

interface EditAchievementButtonProps {
  achievement: Achievement;
}

function EditAchievementButton({ achievement }: EditAchievementButtonProps) {
  const dispatch = useDispatch();

  return (
    <button
      className="common-button primary-button"
      onClick={() => {
        dispatch(
          setCurrentAction(
            achievement.custom
              ? ManageAchievementsCurrentAction.EDIT_CUSTOM
              : ManageAchievementsCurrentAction.EDIT
          )
        );
        dispatch(
          setAchievementState(getAchievementsStateDataHelper(achievement))
        );
        dispatch({ type: "SET_STATE", payload: achievement });
        dispatch(openModal());
      }}
    >
      Edit
    </button>
  );
}
