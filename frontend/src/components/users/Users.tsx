import React from "react";

import { Link } from "react-router-dom";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import { useGetUsersList, User } from "@services/UserService";
import FilterBarUsers from "./filterBarUsers";
import { DateTooltip } from "@components/dateTooltip";
import SortByParamsButton from "@components/SortByParamsButton";

interface UserDetailsProps {
  users: User[];
}

export default function Users() {
  const { data: usersData, loading, error } = useGetUsersList();

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!usersData || loading) return <>Loading...</>;

  const { data, count, currentPage } = usersData;
  return (
    <>
      <PreviousPage />
      <FilterBarUsers />
      <div id="users-list" className="table-list-wrapper">
        <UsersDetails users={data} />
      </div>
      <div className="table-list-pagination">
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={count}
          localStorageName="usersPageSize"
          siblingCount={1}
        />
      </div>
    </>
  );
}

const UsersDetails = ({ users }: UserDetailsProps) => (
  <table id="table-users-list">
    <thead>
      <tr>
        <th>
          <SortByParamsButton buttonText="Username" sortBy="username" />
        </th>
        <th>Achievements</th>
        <th>
          <SortByParamsButton buttonText="Watch" sortBy="watchTime" />
        </th>
        <th>
          <SortByParamsButton buttonText="Last seen" sortBy="lastSeen" />
        </th>
        <th>
          <SortByParamsButton buttonText="Created" sortBy="createdAt" />
        </th>
        <th>
          <SortByParamsButton
            buttonText="Message count"
            sortBy="messageCount"
          />
        </th>
        <th>
          <SortByParamsButton buttonText="Points" sortBy="points" />
        </th>
      </tr>
    </thead>

    <tbody>
      {users.map((user) => {
        const {
          _id,
          username,
          lastSeen,
          createdAt,
          messageCount,
          points,
          watchTime,
        } = user;
        return (
          <tr key={_id}>
            <td className="users-list-username">
              <Link to={`./${_id}`}> {username}</Link>
            </td>
            <td className="users-list-achievements"></td>
            <td className="users-list-watch-time">
              {Math.floor(Number(watchTime) / 60)} min
            </td>
            <td className="users-list-date">
              {lastSeen ? (
                <div className="users-list-date-div">
                  <DateTooltip date={lastSeen} />
                </div>
              ) : null}
            </td>
            <td className="users-list-date">
              {createdAt ? (
                <div className="users-list-date-div">
                  <DateTooltip date={createdAt} />{" "}
                </div>
              ) : null}
            </td>
            <td className="users-list-message-count">
              {messageCount?.toLocaleString()}
            </td>
            <td className="users-list-points">
              {points ? Math.round(points) : null}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);
