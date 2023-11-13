import { Link } from "react-router-dom";

export default function AchievementStageTheadData() {
  return (
    <tr className="stages-list-data-thead">
      <th>Nr. </th>
      <th>Name</th>
      <th>Stage</th>
      <th>
        <Link to="../../badges" className="common-button primary-button">
          Badge
        </Link>
      </th>
      <th>Rarity (1-10)</th>
      <th>Goal</th>
      <th>Show Time (sec)</th>
      <th>
        <Link to="../sounds" className="common-button primary-button">
          Sounds
        </Link>
      </th>
    </tr>
  );
}
