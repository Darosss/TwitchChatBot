import "./style.css";
import React from "react";

import { Link } from "react-router-dom";
import formatDate from "@utils/formatDate";
import Pagination from "@components/pagination";
import PreviousPage from "@components/previousPage";
import UserService, { IUser } from "@services/UserService";
import FilterBarUsers from "./filterBarUsers";

type UserDetailsProps = {
  users: IUser[];
};

const UsersDetails = ({ users }: UserDetailsProps) => (
  <table id="table-users-list">
    <thead>
      <tr>
        <th>Username</th>
        <th>Achievements</th>
        <th>Last seen</th>
        <th>Created</th>
        <th>Message count</th>
        <th>Points</th>
      </tr>
    </thead>

    <tbody>
      {users.map((user) => {
        const { _id, username, lastSeen, createdAt, messageCount, points } =
          user;
        return (
          <tr key={_id}>
            <td className="users-list-username">
              <Link to={`./${_id}`}> {username}</Link>
            </td>
            <td className="users-list-achievements"></td>
            <td className="users-list-last-seen">
              {lastSeen ? (
                <div className="tooltip">
                  {formatDate(lastSeen, "days+time")}
                  <span className="tooltiptext">{formatDate(lastSeen)}</span>
                </div>
              ) : null}
            </td>
            <td className="users-list-created-at">
              <div className="tooltip">
                {formatDate(createdAt, "days+time")}
                <span className="tooltiptext">{formatDate(createdAt)}</span>
              </div>
            </td>
            <td className="users-list-message-count">
              {messageCount?.toLocaleString()}
            </td>
            <td className="users-list-points">{points?.toLocaleString()}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default function Users() {
  const { data: usersData, loading, error } = UserService.getUsersList();

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
