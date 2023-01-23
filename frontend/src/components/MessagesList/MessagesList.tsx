import "./style.css";
import React, { useState } from "react";
import { IMessage, IUser } from "@backend/models/types";
import useFetch from "../../hooks/useFetch.hook";
import Pagination from "../Pagination";
import { useParams } from "react-router-dom";
import PreviousPage from "../PreviousPage";
import formatDate from "../../utils/formatDate";

interface IMessagesList {
  messages: IMessage[];
  totalPages: number;
  messageCount: number;
  currentPage: number;
}

export default function MessagesList() {
  const { userId } = useParams();

  const [currentPageLoc, setCurrentPageLoc] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const messagesUrl =
    process.env.REACT_APP_BACKEND_URL +
    `/messages` +
    (userId ? `/${userId}` : ``) +
    `?page=${currentPageLoc}&limit=${pageSize}`;
  const { data, error } = useFetch<IMessagesList>(messagesUrl);

  if (error) return <p>There is an error. {error.message}</p>;
  if (!data) return <p>Loading...</p>;

  const { messages, messageCount, currentPage } = data;

  return (
    <>
      <PreviousPage />
      <div id="messages-list">
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
                  <td className="message-time">{formatDate(message.date)}</td>
                  <td className="message-username">
                    <a href={"./" + (message.owner as IUser)._id}>
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
