import "./style.css";
import React, { useMemo, useState } from "react";
import { IMessage, IUser } from "@backend/models/types";
import useFetch from "../../hooks/useFetch.hook";
import Pagination from "../Pagination";

interface IMessagesList {
  messages: IMessage[];
  totalPages: number;
  messageCount: number;
  currentPage: number;
}

export default function MessagesList() {
  const [currentPageLoc, setCurrentPageLoc] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, error } = useFetch<IMessagesList>(
    `${process.env.REACT_APP_BACKEND_URL}/messages?page=${currentPageLoc}&limit=${pageSize}`
  );

  if (error) return <p>There is an error.</p>;
  if (!data) return <p>Loading...</p>;

  const { messages, totalPages, messageCount, currentPage } = data;

  return (
    <>
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
            {data.messages.map((message) => {
              return (
                <tr key={message._id + new Date()}>
                  <td className="message-time">
                    {message.date.toLocaleString().split("T")[0] +
                      " " +
                      message.date.toLocaleString().split("T")[1].split(".")[0]}
                  </td>
                  <td className="message-username">
                    {(message.owner as unknown as IUser).username}
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
