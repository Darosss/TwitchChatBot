import { DateTooltip } from "@components/dateTooltip";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import { setName } from "@redux/stagesSlice";

interface BaseDetailsAchievementStageProps {
  editing: boolean;
}
export default function BaseDetailsAchievementStage({
  editing,
}: BaseDetailsAchievementStageProps) {
  const dispatch = useDispatch();
  const { stage } = useSelector((root: RootStore) => root.stages);

  return (
    <>
      <div>
        <div>Name</div>
        <div>
          {editing ? (
            <input
              type="text"
              value={stage.name}
              onChange={(e) => dispatch(setName(e.target.value))}
            />
          ) : (
            stage.name
          )}
        </div>
      </div>
      <div>
        <div>Created / updated</div>
        <div>
          <DateTooltip date={stage.createdAt} />
        </div>
        <div>
          <DateTooltip date={stage.updatedAt} />
        </div>
      </div>
    </>
  );
}
