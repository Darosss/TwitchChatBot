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
import Error from "@components/axiosHelper/errors";
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
//TODO: add query params to user/session based

const MessagesUser = () => {
  const { userId } = useParams();
  const { data, isLoading, error } = useGetUserMessages(userId!);
  if (error) return <Error error={error} />;
  if (!data || isLoading) return <Loading />;

  return <Messages messagesData={data} />;
};

const MessagesSession = () => {
  const { sessionId } = useParams();
  const { data, isLoading, error } = useGetSessionMessages(sessionId!);
  if (error) return <Error error={error} />;
  if (!data || isLoading) return <Loading />;

  return <Messages messagesData={data} />;
};

const MessagesAll = () => {
  const queryParams = useQueryParams(fetchMessagesDefaultParams);
  const { data, isLoading, error } = useGetMessages(queryParams);
  if (error) return <Error error={error} />;
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
