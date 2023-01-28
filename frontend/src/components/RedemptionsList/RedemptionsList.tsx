import "./style.css";
import React, { useState } from "react";
import { IRedemption } from "@backend/models/types";
import Pagination from "../Pagination";
import { useParams } from "react-router-dom";
import PreviousPage from "../PreviousPage";
import formatDate from "../../utils/formatDate";
import useAxios from "axios-hooks";

interface IMessagesList {
  redemptions: IRedemption[];
  totalPages: number;
  messageCount: number;
  currentPage: number;
}

export default function MessagesList(props: {
  messages: "all" | "session" | "user";
}) {
  const { userId, sessionId } = useParams();

  const [currentPageLoc, setCurrentPageLoc] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  let redemptionsApiUrl = `/redemptions`;
  // let redemptionsHref = ``;

  switch (props.messages) {
    case "session":
      redemptionsApiUrl += `/twitch-session/${sessionId}`;
      // redemptionsHref += "../";
      break;
    case "user":
      redemptionsApiUrl += `/${userId}`;
      break;
    default:
    // redemptionsHref += "messages/";
  }
  redemptionsApiUrl += `?page=${currentPageLoc}&limit=${pageSize}`;

  const [{ data, loading, error }] = useAxios<IMessagesList>(redemptionsApiUrl);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  if (!data) return <>Something went wrong!</>;

  const { redemptions, messageCount, currentPage } = data;
  return (
    <>
      <PreviousPage />
      <div id="messages-list">
        <table id="table-messages-list">
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
      <div className="pagination">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={messageCount}
          pageSize={pageSize}
          onPageSizeChange={(pageSize) => setPageSize(pageSize)}
          onPageChange={(page) => setCurrentPageLoc(page)}
          siblingCount={1}
        />
      </div>
    </>
  );
}
