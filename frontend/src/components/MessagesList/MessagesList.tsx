import "./style.css";
import React, { useState } from "react";
import { IMessage, IUser } from "@backend/models/types";
import Pagination from "@components/Pagination";
import { useParams } from "react-router-dom";
import PreviousPage from "@components/PreviousPage";
import formatDate from "@utils/formatDate";
import useAxios from "axios-hooks";

interface IMessagesList {
  messages: IMessage[];
  totalPages: number;
  count: number;
  currentPage: number;
}

export default function MessagesList(props: {
  messages: "all" | "session" | "user";
}) {
  const { userId, sessionId } = useParams();

  const [currentPageLoc, setCurrentPageLoc] = useState(1);
  const [pageSize, setPageSize] = useState(
    Number(localStorage.getItem("messagesListPageSize")) || 15
  );
  let messageApiUrl = `/messages`;
  let messageHref = ``;

  switch (props.messages) {
    case "session":
      messageApiUrl += `/twitch-session/${sessionId}`;
      messageHref += "../";
      break;
    case "user":
      messageApiUrl += `/${userId}`;
      break;
    default:
      messageHref += "messages/";
  }
  messageApiUrl += `?page=${currentPageLoc}&limit=${pageSize}`;

  // const { data, error } = useFetch<IMessagesList>(messageApiUrl);
  const [{ data, loading, error }] = useAxios<IMessagesList>(messageApiUrl);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  if (!data) return <>Something went wrong!</>;

  const { messages, count, currentPage } = data;

  return (
    <>
      <PreviousPage />
      <div id="messages-list" className="table-list-wrapper">
        <table id="table-messages-list">
          <thead>
            <tr>
              <th>Date</th>
              <th>Username</th>
              <th colSpan={4}>Message</th>
            </tr>
          </thead>

          <tbody>
            {messages.map((message) => {
              return (
                <tr key={message._id + new Date()}>
                  <td className="message-time">
                    <div className="tooltip">
                      {formatDate(message.date, "days+time")}
                      <span className="tooltiptext">
                        {formatDate(message.date)}
                      </span>
                    </div>
                  </td>

                  <td className="message-username">
                    <a href={`${messageHref}` + (message.owner as IUser)._id}>
                      {(message.owner as IUser).username}
                    </a>
                  </td>
                  <td className="message" colSpan={4}>
                    {message.message}
                  </td>
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
          localStorageName="messagesListPageSize"
          onPageSizeChange={(pageSize) => setPageSize(pageSize)}
          onPageChange={(page) => setCurrentPageLoc(page)}
          siblingCount={1}
        />
      </div>
    </>
  );
}
