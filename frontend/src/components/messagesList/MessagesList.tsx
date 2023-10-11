import React from "react";

import Pagination from "@components/pagination";
import { Link, useParams } from "react-router-dom";
import PreviousPage from "@components/previousPage";
import FilterBarMessages from "./filterBarMessages";
import { PaginationData } from "@services/ApiService";
import { useGetMessages, Message } from "@services/MessageService";
import { useGetUserMessages } from "@services/UserService";
import { useGetSessionMessages } from "@services/StreamSessionService";
import { DateTooltip } from "@components/dateTooltip";
import SortByParamsButton from "@components/SortByParamsButton";

interface MessagesDetailsProp {
  messages: Message[];
}

interface MessagesListProps {
  messages: "user" | "session" | "all";
}

interface MessagesProps {
  messagesData: PaginationData<Message>;
}

export default function MessagesList({ messages }: MessagesListProps) {
  switch (messages) {
    case "session":
      return <MessagesSession />;
    case "user":
      return <MessagesUser />;
    case "all":
    default:
      return <MessagesAll />;
  }
}

const MessagesUser = () => {
  const { userId } = useParams();
  const { data, loading, error } = useGetUserMessages(userId!);
  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  return <Messages messagesData={data} />;
};

const MessagesSession = () => {
  const { sessionId } = useParams();
  const { data, loading, error } = useGetSessionMessages(sessionId!);
  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  return <Messages messagesData={data} />;
};

const MessagesAll = () => {
  const { data, loading, error } = useGetMessages();
  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  return <Messages messagesData={data} />;
};

const MessagesDetails = ({ messages }: MessagesDetailsProp) => (
  <table className="table-messages-list">
    <thead>
      <tr>
        <th>
          <SortByParamsButton buttonText="Date" sortBy="date" />
        </th>
        <th>Username</th>
        <th colSpan={4}>
          <SortByParamsButton buttonText="Message" sortBy="message" />
        </th>
      </tr>
    </thead>

    <tbody>
      {messages.map((message, index) => (
        <tr key={index}>
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
            <div> {message.message}</div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
const Messages = ({
  messagesData: { data, currentPage, count },
}: MessagesProps) => {
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
