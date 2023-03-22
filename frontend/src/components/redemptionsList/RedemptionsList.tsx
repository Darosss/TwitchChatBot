import "./style.css";
import React from "react";

import Pagination from "@components/pagination";
import { Link, useParams } from "react-router-dom";
import PreviousPage from "@components/previousPage";
import FilterBarRedemptions from "./filterBarRedemptions";
import { getRedemptions, Redemption } from "src/services/RedemptionService";
import { PaginationData } from "@services/ApiService";
import { getSessionRedemptions } from "@services/StreamSessionService";
import { getUserRedemptions } from "@services/UserService";
import { DateTooltip } from "@components/dateTooltip";

type RedemptionsDetailProps = {
  redemptions: Redemption[];
};

export default function RedemptionsList(props: {
  redemptions: "all" | "session" | "user";
}) {
  const { redemptions } = props;

  switch (redemptions) {
    case "user":
      return <RedemptionsUser />;
      break;
    case "session":
      return <RedemptionsSession />;
      break;
    default:
      return <RedemptionsAll />;
  }
}

const RedemptionsUser = () => {
  const { userId } = useParams();
  const { data, loading, error } = getUserRedemptions(userId!);
  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  return <Redemptions redemptionsData={data} />;
};

const RedemptionsSession = () => {
  const { sessionId } = useParams();
  const { data, loading, error } = getSessionRedemptions(sessionId!);
  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  return <Redemptions redemptionsData={data} />;
};

const RedemptionsAll = () => {
  const { data, loading, error } = getRedemptions();
  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  return <Redemptions redemptionsData={data} />;
};

const RedemptionsDetails = ({ redemptions }: RedemptionsDetailProps) => (
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
            <td className="redemptions-list-name">{redemption.rewardTitle}</td>
            <td>
              <Link to={`/users/${redemption.userId}`}>
                {redemption.userName}
              </Link>
            </td>
            <td className="redemptions-list-date">
              <DateTooltip date={redemption.redemptionDate} />
            </td>
            <td>{redemption.rewardCost}</td>
            <td>{redemption.message}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

const Redemptions = (props: {
  redemptionsData: PaginationData<Redemption>;
}) => {
  const { data, currentPage, count } = props.redemptionsData;
  return (
    <>
      <PreviousPage />
      <FilterBarRedemptions />

      <div id="redemptions-list" className="table-list-wrapper">
        <RedemptionsDetails redemptions={data} />
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
};
