import "./style.css";
import React, { useState } from "react";
import { IRedemption } from "@backend/models/types";
import Pagination from "@components/Pagination";
import { useParams, useSearchParams } from "react-router-dom";
import PreviousPage from "@components/PreviousPage";
import formatDate from "@utils/formatDate";
import useAxios from "axios-hooks";
import FilterBarRedemptions from "./FilterBarRedemptions";

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
  const [searchParams] = useSearchParams();

  const [currentPageLoc, setCurrentPageLoc] = useState(1);
  const [pageSize, setPageSize] = useState(
    Number(localStorage.getItem("redemptionsListPageSize")) || 15
  );

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
  redemptionsApiUrl += `?page=${currentPageLoc}&limit=${pageSize}&${searchParams}`;

  const [{ data, loading, error }] =
    useAxios<IRedemptionsList>(redemptionsApiUrl);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading</>;

  const { redemptions, count, currentPage } = data;
  return (
    <>
      <PreviousPage />
      <FilterBarRedemptions />

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
      </div>
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={count}
          pageSize={pageSize}
          localStorageName="redemptionsListPageSize"
          onPageSizeChange={(pageSize) => setPageSize(pageSize)}
          onPageChange={(page) => setCurrentPageLoc(page)}
          siblingCount={1}
        />
      </div>
    </>
  );
}
