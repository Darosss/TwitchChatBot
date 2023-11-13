import { DateTooltip } from "@components/dateTooltip";
import { useAchievementStageContext } from "./Context";

interface BaseDetailsAchievementStageProps {
  editing: boolean;
}
export default function BaseDetailsAchievementStage({
  editing,
}: BaseDetailsAchievementStageProps) {
  const {
    achievementStageState: [state, dispatch],
  } = useAchievementStageContext();
  return (
    <>
      <div>
        <div>Name</div>
        <div>
          {editing ? (
            <input
              type="text"
              value={state.name}
              onChange={(e) =>
                dispatch({ type: "SET_NAME", payload: e.target.value })
              }
            />
          ) : (
            state.name
          )}
        </div>
      </div>
      <div>
        <div>Created / updated</div>
        <div>
          <DateTooltip date={state.createdAt} />
        </div>
        <div>
          <DateTooltip date={state.updatedAt} />
        </div>
      </div>
    </>
  );
}
