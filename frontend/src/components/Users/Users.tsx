import React, { useEffect, useState } from "react";
import "./style.css";
import { IUser } from "@backend/models/types/";
import Pagination from "@components/Pagination";
import formatDate from "@utils/formatDate";
import useAxios from "axios-hooks";
import PreviousPage from "@components/PreviousPage";
import FilterBarUsers from "./FilterBarUsers";
import { useSearchParams } from "react-router-dom";
// import { getUsersList } from "src/services/api.service";

interface IUsersRes {
  users: IUser[];
  totalPages: number;
  count: number;
  currentPage: number;
}

export default function Users() {
  const [searchParams] = useSearchParams();

  // const { data: test, refetch } = getUsersList(searchParams);

  const [{ data, loading, error }] = useAxios<IUsersRes>(
    `/users?${searchParams}`
  );

  useEffect(() => {
    console.log(searchParams);
  }, [searchParams]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading...</>;

  const { users, count, currentPage } = data;

  return (
    <>
      <PreviousPage />
      <FilterBarUsers />
      <div id="users-list" className="table-list-wrapper">
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
              return (
                <tr key={user._id}>
                  <td className="users-list-username">
                    <a href={"user/" + user._id}>{user.username} </a>
                  </td>
                  <td className="users-list-achievements"></td>
                  <td className="users-list-last-seen">
                    <div className="tooltip">
                      {formatDate(user.lastSeen, "days+time")}
                      <span className="tooltiptext">
                        {formatDate(user.lastSeen)}
                      </span>
                    </div>
                  </td>
                  <td className="users-list-created-at">
                    <div className="tooltip">
                      {formatDate(user.createdAt, "days+time")}
                      <span className="tooltiptext">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="users-list-message-count">
                    {user.messageCount?.toLocaleString()}
                  </td>
                  <td className="users-list-points">
                    {user.points?.toLocaleString()}
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
          localStorageName="usersPageSize"
          siblingCount={1}
        />
      </div>
    </>
  );
}
