import React from "react";
import useFetch from "../../hooks/useFetch.hook";
import "./style.css";
import { IUser } from "@backend/models/types/";

interface IUsersRes {
  users: IUser[];
  totalPages: number;
  currentPage: number;
}

export default function Users() {
  const { data, error } = useFetch<IUsersRes>(
    `${process.env.REACT_APP_BACKEND_URL}/users`
  );

  if (error) return <p>There is an error.</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Last seen</th>
            <th>Message count</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user) => {
            return (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.lastSeen.toLocaleString()}</td>
                <td>{user.messageCount.toLocaleString()}</td>
                <td>{user.points.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
