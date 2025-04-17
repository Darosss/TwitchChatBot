import Pagination from "@components/pagination";
import { Link, useParams } from "react-router-dom";
import PreviousPage from "@components/previousPage";
import FilterBarMessages from "./filterBarMessages";
import {
  PaginationData,
  useGetMessages,
  Message,
  useGetUserMessages,
  useGetSessionMessages,
  fetchMessagesDefaultParams,
} from "@services";
import { DateTooltip } from "@components/dateTooltip";
import SortByParamsButton from "@components/SortByParamsButton";
import ErrorHelper from "@components/axiosHelper/errors";
import Loading from "@components/axiosHelper/loading";

import { useQueryParams } from "@hooks/useQueryParams";

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
  const { userId, sessionId } = useParams();

  switch (messages) {
    case "session":
      return sessionId ? (
        <MessagesSession sessionId={sessionId} />
      ) : (
        <ErrorHelper
          error={
            new Error(
              "Session id must be provided in order to get session messages"
            )
          }
        />
      );
    case "user":
      return userId ? (
        <MessagesUser userId={userId} />
      ) : (
        <ErrorHelper
          error={
            new Error("User id must be provided in order to get user messages")
          }
        />
      );
    case "all":
    default:
      return <MessagesAll />;
  }
}

interface MessagesUserProps {
  userId: string;
}

const MessagesUser = ({ userId }: MessagesUserProps) => {
  const queryParams = useQueryParams(fetchMessagesDefaultParams);
  const { data, isLoading, error } = useGetUserMessages(userId, queryParams);

  if (error) return <ErrorHelper error={error} />;
  if (!data || isLoading) return <Loading />;
  return <Messages messagesData={data} />;
};

interface MessagesSessionProps {
  sessionId: string;
}

const MessagesSession = ({ sessionId }: MessagesSessionProps) => {
  const queryParams = useQueryParams(fetchMessagesDefaultParams);
  const { data, isLoading, error } = useGetSessionMessages(
    sessionId,
    queryParams
  );
  if (error) return <ErrorHelper error={error} />;
  if (!data || isLoading) return <Loading />;

  return <Messages messagesData={data} />;
};

const MessagesAll = () => {
  const queryParams = useQueryParams(fetchMessagesDefaultParams);
  const { data, isLoading, error } = useGetMessages(queryParams);
  if (error) return <ErrorHelper error={error} />;
  if (!data || isLoading) return <Loading />;

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
