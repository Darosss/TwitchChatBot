import "./style.css";

import React from "react";
import Pagination from "@components/pagination";
import formatDate from "@utils/formatDate";
import { Link } from "react-router-dom";
import PreviousPage from "@components/previousPage";
import FilterBarSessions from "./filterBarSessions";
import { getSessions } from "@services/StreamSessionService";

export default function StreamSessions() {
  const { data: sessionsData, loading, error, refetchData } = getSessions();

  if (error) return <>Error! {error.response?.data.message}</>;
  if (!sessionsData || loading) return <>Loading...</>;

  const { data, count, currentPage } = sessionsData;

  return (
    <>
      <PreviousPage />
      <FilterBarSessions />
      <div id="stream-session-list" className="table-list-wrapper">
        <table id="table-stream-session-list">
          <thead>
            <tr>
              <th>Messages</th>
              <th>Redemptions</th>
              <th>Session</th>
              <th>Titles</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Tags</th>
              <th>Categories</th>
            </tr>
          </thead>
          <tbody>
            {data.map((session) => {
              return (
                <tr key={session._id}>
                  <td>
                    <Link to={`./${session._id}/messages`}>Messages</Link>
                  </td>
                  <td>
                    <Link to={`./${session._id}/redemptions`}>Redemptions</Link>
                  </td>
                  <td>
                    <Link to={`/stream-sessions/${session._id}`}>
                      Session profile
                    </Link>
                  </td>
                  <td>{Object.values(session.sessionTitles)[0]}</td>
                  <td>
                    <div className="tooltip">
                      {formatDate(session.sessionStart, "days+time")}
                      <span className="tooltiptext">
                        {formatDate(session.sessionStart)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="tooltip">
                      {formatDate(session.sessionEnd, "days+time")}
                      <span className="tooltiptext">
                        {formatDate(session.sessionEnd)}
                      </span>
                    </div>
                  </td>
                  <td>{session.tags ? Object.values(session.tags) : null}</td>
                  <td>{Object.values(session.categories)[0]}</td>
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
          localStorageName="streamSessionPageSize"
          siblingCount={1}
        />
      </div>
    </>
  );
}
