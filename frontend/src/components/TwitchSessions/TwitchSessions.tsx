import React, { useState } from "react";
import useFetch from "../../hooks/useFetch.hook";
import "./style.css";
import { ITwitchSession } from "@backend/models/types/";
import Pagination from "../Pagination";
import formatDate from "../../utils/formatDate";
import { Link } from "react-router-dom";

interface ITwitchSessionRes {
  twitchSessions: ITwitchSession[];
  totalPages: number;
  usersCount: number;
  currentPage: number;
}

export default function TwitchSessions() {
  const [currentPageLoc, setCurrentPageLoc] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { data, error } = useFetch<ITwitchSessionRes>(
    `${process.env.REACT_APP_BACKEND_URL}/twitch-sessions?page=${currentPageLoc}&limit=${pageSize}&`
  );

  if (error) return <p>There is an error.</p>;
  if (!data) return <p>Loading...</p>;

  const { twitchSessions, usersCount, currentPage } = data;

  return (
    <>
      <div id="users-list">
        <table id="table-users-list">
          <thead>
            <tr>
              <th>Messages</th>
              <th>Redemptions</th>
              <th>Titles</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Tags</th>
              <th>Categories</th>
            </tr>
          </thead>
          <tbody>
            {twitchSessions.map((session) => {
              return (
                <tr key={session._id}>
                  <td>
                    <Link to={`../messages/twitch-session/${session._id}`}>
                      Messages
                    </Link>
                  </td>
                  <td>
                    <Link to={`../redemptions/twitch-session/${session._id}`}>
                      Redemptions
                    </Link>
                  </td>
                  <td>{session.sessionTitles.join(", ")}</td>
                  <td>{formatDate(session.sessionStart)}</td>
                  <td>{formatDate(session.sessionEnd)}</td>
                  <td>{session.tags.join(", ")}</td>
                  <td>{session.categories.join(", ")}</td>
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
          totalCount={usersCount}
          pageSize={pageSize}
          onPageSizeChange={(pageSize) => setPageSize(pageSize)}
          onPageChange={(page) => setCurrentPageLoc(page)}
          siblingCount={1}
        />
      </div>
    </>
  );
}