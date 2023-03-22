import "./style.css";
import React from "react";

import Pagination from "@components/pagination";
import { Link, useParams } from "react-router-dom";
import PreviousPage from "@components/previousPage";
import FilterBarMessages from "./filterBarMessages";
import { PaginationData } from "@services/ApiService";
import { getMessages, Message } from "@services/MessageService";
import { getUserMessages } from "@services/UserService";
import { getSessionMessages } from "@services/StreamSessionService";
import { DateTooltip } from "@components/dateTooltip";

interface MessagesDetailsProp {
  messages: Message[];
}

export default function MessagesList(props: {
  messages: "all" | "session" | "user";
}) {
  const { messages } = props;

  switch (messages) {
    case "user":
      return <MessagesUser />;
      break;
    case "session":
      return <MessagesSession />;
      break;
    default:
      return <MessagesAll />;
  }
}

const MessagesUser = () => {
  const { userId } = useParams();
  const { data, loading, error } = getUserMessages(userId!);
  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  return <Messages messagesData={data} />;
};

const MessagesSession = () => {
  const { sessionId } = useParams();
  const { data, loading, error } = getSessionMessages(sessionId!);
  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  return <Messages messagesData={data} />;
};

const MessagesAll = () => {
  const { data, loading, error } = getMessages();
  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  return <Messages messagesData={data} />;
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
              <div className="message-time-div">
                <DateTooltip date={message.date} />
              </div>
            </td>

            <td className="message-username">
              <Link to={`/users/${message.owner._id}`}>
                <div>{message.owner.username}</div>
              </Link>
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
const Messages = (props: { messagesData: PaginationData<Message> }) => {
  const { data, currentPage, count } = props.messagesData;
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
};
