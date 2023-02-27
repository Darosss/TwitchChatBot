import "./style.css";
import React from "react";
import Pagination from "@components/Pagination";
import { useParams } from "react-router-dom";
import PreviousPage from "@components/PreviousPage";
import formatDate from "@utils/formatDate";
import FilterBarRedemptions from "./FilterBarRedemptions";
import RedemptionService, {
  IRedemption,
} from "src/services/Redemption.service";

type MessagesDetailsProp = {
  redemptions: IRedemption[];
};

const MessagesDetails = ({ redemptions }: MessagesDetailsProp) => (
  <table id="table-redemptions-list">
    <thead>
      <tr>
        <th>Reward name</th>
        <th>Receiver</th>
        <th>Date</th>
        <th>Cost</th>
        <th>Message</th>
      </tr>
    </thead>

    <tbody>
      {redemptions.map((redemption) => {
        return (
          <tr key={redemption._id}>
            <td>{redemption.rewardTitle}</td>
            <td>
              {/* <Link to={`../user/${redemption.userId}`}> */}
              {redemption.userName}
              {/* </Link> */}
            </td>
            <td>
              <div className="tooltip">
                {formatDate(redemption.redemptionDate, "days+time")}
                <span className="tooltiptext">
                  {formatDate(redemption.redemptionDate)}
                </span>
              </div>
            </td>
            <td>{redemption.rewardCost}</td>
            <td>{redemption.message}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);
export default function RedemptionsList(props: {
  redemptions: "all" | "session" | "user";
}) {
  const { redemptions } = props;
  const { userId, sessionId } = useParams();

  const {
    data: redemptionsData,
    loading,
    error,
  } = RedemptionService.getRedemptions(redemptions, sessionId, userId);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!redemptionsData || loading) return <>Loading</>;

  const { data, count, currentPage } = redemptionsData;
  return (
    <>
      <PreviousPage />
      <FilterBarRedemptions />

      <div id="redemptions-list" className="table-list-wrapper">
        <MessagesDetails redemptions={data} />
      </div>
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={count}
          localStorageName="redemptionsListPageSize"
          siblingCount={1}
        />
      </div>
    </>
  );
}
