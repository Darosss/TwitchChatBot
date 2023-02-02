import "./style.css";
import React, { useState } from "react";
import { IRedemption } from "@backend/models/types";
import Pagination from "@components/Pagination";
import { useParams } from "react-router-dom";
import PreviousPage from "@components/PreviousPage";
import formatDate from "@utils/formatDate";
import useAxios from "axios-hooks";

interface IRedemptionsList {
  redemptions: IRedemption[];
  totalPages: number;
  count: number;
  currentPage: number;
}

export default function RedemptionsList(props: {
  redemptions: "all" | "session" | "user";
}) {
  const { userId, sessionId } = useParams();

  const [currentPageLoc, setCurrentPageLoc] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  let redemptionsApiUrl = `/redemptions`;
  // let redemptionsHref = ``;

  switch (props.redemptions) {
    case "session":
      redemptionsApiUrl += `/twitch-session/${sessionId}`;
      // redemptionsHref += "../";
      break;
    case "user":
      redemptionsApiUrl += `/${userId}`;
      break;
    default:
  }
  redemptionsApiUrl += `?page=${currentPageLoc}&limit=${pageSize}`;

  const [{ data, loading, error }] =
    useAxios<IRedemptionsList>(redemptionsApiUrl);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  if (!data) return <>Something went wrong!</>;

  const { redemptions, count, currentPage } = data;
  return (
    <>
      <PreviousPage />
      <div id="redemptions-list" className="table-list-wrapper">
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
                  <td>{formatDate(redemption.redemptionDate)}</td>
                  <td>{redemption.rewardCost}</td>
                  <td>{redemption.message}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={count}
          pageSize={pageSize}
          onPageSizeChange={(pageSize) => setPageSize(pageSize)}
          onPageChange={(page) => setCurrentPageLoc(page)}
          siblingCount={1}
        />
      </div>
    </>
  );
}
