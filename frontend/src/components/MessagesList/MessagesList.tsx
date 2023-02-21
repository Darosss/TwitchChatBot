import "./style.css";
import React from "react";
import Pagination from "@components/Pagination";
import { useParams } from "react-router-dom";
import PreviousPage from "@components/PreviousPage";
import formatDate from "@utils/formatDate";
import FilterBarMessages from "./FilterBarMessages";
import MessageService, { IMessage } from "src/services/Message.service";

type MessagesDetailsProp = {
  messages: IMessage[];
};

const MessagesDetails = ({ messages }: MessagesDetailsProp) => (
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
                <span className="tooltiptext">{formatDate(message.date)}</span>
              </div>
            </td>

            <td className="message-username">
              <a href={`${"link"}` + message.owner._id}>
                <div className="tooltip">
                  {message.owner.username}
                  <span className="tooltiptext">{message.ownerUsername}</span>
                </div>
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
);

export default function MessagesList(props: {
  messages: "all" | "session" | "user";
}) {
  const { messages } = props;
  const { userId, sessionId } = useParams();

  const {
    data: messagesData,
    loading,
    error,
  } = MessageService.getMessages(messages, sessionId, userId);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!messagesData || loading) return <>Loading!</>;

  const { data, count, currentPage } = messagesData;

  return (
    <>
      <PreviousPage />
      <FilterBarMessages />
      <div id="messages-list" className="table-list-wrapper">
        <MessagesDetails messages={data} />
      </div>
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={count}
          localStorageName="messagesListPageSize"
          siblingCount={1}
        />
      </div>
    </>
  );
}
