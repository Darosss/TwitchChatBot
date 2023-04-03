import React from "react";
import Pagination from "@components/pagination";
import { Link } from "react-router-dom";
import PreviousPage from "@components/previousPage";
import FilterBarSessions from "./filterBarSessions";
import { getSessions } from "@services/StreamSessionService";
import { DateDifference, DateTooltip } from "@components/dateTooltip";
import SortByParamsButton from "@components/SortByParamsButton";

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
              <th colSpan={3}>Action </th>
              <th>
                <SortByParamsButton
                  buttonText="Titles"
                  sortBy="sessionTitles"
                />
              </th>
              <th>
                <SortByParamsButton
                  buttonText="Start date"
                  sortBy="sessionStart"
                />
              </th>
              <th>Session time</th>
              <th>
                <SortByParamsButton buttonText="End date" sortBy="sessionEnd" />
              </th>
              <th>Tags</th>
              <th>
                <SortByParamsButton
                  buttonText="Categories"
                  sortBy="categories"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((session) => {
              return (
                <tr key={session._id}>
                  <td colSpan={3}>
                    <div className="sessions-list-actions">
                      <Link to={`./${session._id}/messages`}>Messages</Link>
                      <Link to={`./${session._id}/redemptions`}>
                        Redemptions
                      </Link>
                      <Link to={`/stream-sessions/${session._id}`}>
                        Session profile
                      </Link>
                    </div>
                  </td>

                  <td className="sessions-list-title">
                    {Object.values(session.sessionTitles)[0]}
                  </td>
                  <td className="sessions-list-date">
                    <DateTooltip date={session.sessionStart} />
                  </td>
                  <td className="sessions-list-date">
                    {session.sessionEnd ? (
                      <DateDifference
                        dateStart={session.sessionStart}
                        dateEnd={session.sessionEnd}
                        format="h"
                      />
                    ) : null}
                  </td>
                  <td className="sessions-list-date">
                    {session.sessionEnd ? (
                      <DateTooltip date={session.sessionEnd} />
                    ) : null}
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
