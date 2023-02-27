import "./style.css";
import React from "react";
import { useParams } from "react-router-dom";
import StreamSessionService from "@services/StreamSessionService";
import formatDate from "@utils/formatDate";
import LineChart from "@components/LineChart";
import PreviousPage from "@components/PreviousPage";
import SlideShow from "@components/SlideShow";

export default function StreamSessionDetail() {
  const { sessionId } = useParams();
  const {
    data: sessionData,
    loading,
    error,
  } = StreamSessionService.getSessionById(sessionId || "");

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!sessionData || loading) return <>Loading!</>;

  const { data } = sessionData;
  return (
    <>
      <PreviousPage />
      <div className="stream-session-details-wrapper">
        <div className="session-details session-small-details small">
          <div className="nested-detail">
            <div className="session-detail-header">Session start:</div>
            <div>{formatDate(data.sessionStart, "days+time")}</div>
            <div className="session-detail-header">Session end:</div>
            <div>{formatDate(data.sessionEnd, "days+time")}</div>
          </div>
        </div>

        <div className="session-title-details session-large-details">
          <div className="nested-detail">
            <div className="session-detail-header">Titles:</div>
            <div className="nested-detail">
              <ul className="session-detail-ul">
                {Object.keys(data.sessionTitles).map((timestamp, index) => {
                  return (
                    <li key={index}>
                      {formatDate(timestamp, "time")}:
                      {data.sessionTitles[timestamp]}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="session-categories-details session-large-details">
          <div className="nested-detail">
            <div className="session-detail-header">Categories:</div>
            <div className="nested-detail">
              <ul className="session-detail-ul">
                {Object.keys(data.categories).map((timestamp, index) => {
                  return (
                    <li key={index}>
                      {formatDate(timestamp, "time")}:
                      {data.categories[timestamp]}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="session-graphs-details session-large-details">
          <div className="nested-detail">
            <div className="nested-detail">
              <SlideShow styleWrapper={{ width: "37vmax" }}>
                {data.viewers ? (
                  <LineChart
                    data={data.viewers}
                    chartOptions={{ title: "Viewers peek", label: "viewers" }}
                  />
                ) : null}
              </SlideShow>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
