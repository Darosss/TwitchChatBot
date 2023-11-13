import SortByParamsButton from "@components/SortByParamsButton";
import { Link } from "react-router-dom";
import { useBadgeContextEditCreateData } from "./ContextEditCreateData";

export default function THeadBadgeData() {
  const {
    showModalState: [, setModalState],
  } = useBadgeContextEditCreateData();
  return (
    <tr>
      <th>
        Actions
        <button
          className="common-button primary-button"
          onClick={(e) => {
            setModalState(true);
          }}
        >
          New
        </button>
      </th>
      <th>
        <SortByParamsButton buttonText="Name" sortBy="name" />
      </th>
      <th>
        Image url
        <Link to="images" className="primary-button common-button">
          All images
        </Link>
      </th>
      <th>Description</th>
      <th className="badge-table-data">
        <SortByParamsButton buttonText="Created At" sortBy="createdAt" />
      </th>
      <th className="badge-table-data">
        <SortByParamsButton buttonText="Updated at" sortBy="updatedAt" />
      </th>
    </tr>
  );
}
