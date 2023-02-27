import React from "react";
import "./style.css";
import Pagination from "@components/Pagination";
import formatDate from "@utils/formatDate";
import { Link } from "react-router-dom";
import PreviousPage from "@components/PreviousPage";
import FilterBarSessions from "./FilterBarSessions";
import twitchSessionService from "src/services/Twitch-session.service";

export default function TwitchSessions() {
  const {
    data: sessionsData,
    loading,
    error,
    refetchData,
  } = twitchSessionService.getSessions();

  if (error) return <>Error! {error.response?.data.message}</>;
  if (!sessionsData || loading) return <>Loading...</>;

  const { data, count, currentPage } = sessionsData;

  return (
    <>
      <PreviousPage />
      <FilterBarSessions />
      <div id="twitch-session-list" className="table-list-wrapper">
        <table id="table-twitch-session-list">
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
                    <Link to={`/messages/stream-session/${session._id}`}>
                      Messages
                    </Link>
                  </td>
                  <td>
                    <Link to={`/redemptions/stream-session/${session._id}`}>
                      Redemptions
                    </Link>
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
          localStorageName="twitchSessionPageSize"
          siblingCount={1}
        />
      </div>
    </>
  );
}
