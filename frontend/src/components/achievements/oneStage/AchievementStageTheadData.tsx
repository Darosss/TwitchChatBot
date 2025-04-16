import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootStore } from "@redux/store";
import { setIsGoalTime } from "@redux/stagesSlice";
interface AchievementStageTheadDataProps {
  editing: boolean;
}
export default function AchievementStageTheadData({
  editing,
}: AchievementStageTheadDataProps) {
  return (
    <tr className="stages-list-data-thead">
      <th>Nr. </th>
      <th>
        <div>
          <div>Name</div>
          <div>Stage</div>
          <div> Rarity (1-10)</div>
        </div>
      </th>
      <th>Goal {editing ? <ToggleGoalIsTimeBtn /> : null}</th>
      <th>Show Time (sec)</th>
      <th>
        <Link to="../../badges" className="common-button primary-button">
          Badge
        </Link>
      </th>
      <th>
        <Link to="../sounds" className="common-button primary-button">
          Sounds
        </Link>
      </th>
    </tr>
  );
}

function ToggleGoalIsTimeBtn() {
  const { isGoalTime } = useSelector((root: RootStore) => root.stages);
  const dispatch = useDispatch();
  return (
    <button
      className={`common-button ${
        isGoalTime ? "primary-button" : "danger-button"
      }`}
      onClick={() => dispatch(setIsGoalTime(!isGoalTime))}
    >
      {isGoalTime ? "Time" : "Points"}
    </button>
  );
}
