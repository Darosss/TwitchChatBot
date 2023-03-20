import "./style.css";
import React from "react";
import { useParams } from "react-router-dom";
import formatDate from "@utils/formatDate";
import LineChart from "@components/lineChart";
import PreviousPage from "@components/previousPage";
import SlideShow from "@components/slideShow";
import { getSessionById } from "@services/StreamSessionService";

export default function StreamSessionDetail() {
  const { sessionId } = useParams();
  const { data: sessionData, loading, error } = getSessionById(sessionId || "");

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!sessionData || loading) return <>Loading!</>;

  const { data } = sessionData;

  const calculateTimeStream = (startDate: Date, endDate: Date) => {
    return (
      (new Date(startDate).getTime() - new Date(endDate).getTime()) /
      1000 /
      60 /
      60
    ).toPrecision(2);
  };

  return (
    <>
      <PreviousPage />
      <div className="stream-session-details-wrapper">
        <div className="session-details session-small-details small">
          <div className="nested-detail">
            <div className="session-detail-header">Session start:</div>
            <div>{formatDate(data.sessionStart, "days+time")}</div>
            <div className="session-detail-header">Session time:</div>
            <div>
              {calculateTimeStream(data.sessionEnd, data.sessionStart)}h
            </div>
            <div className="session-detail-header">Session end:</div>
            <div>{formatDate(data.sessionEnd, "days+time")}</div>
          </div>
        </div>

        <div className="session-title-details session-large-details">
          <div className="nested-detail">
            <div className="session-detail-header">Titles:</div>
            <div className="nested-detail">
              <div className="session-detail-list-wrapper">
                {Object.keys(data.sessionTitles).map((timestamp, index) => {
                  return (
                    <div key={index} className="session-detail-list">
                      <div> {formatDate(timestamp, "time")}:</div>
                      <div> {data.sessionTitles[timestamp]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="session-categories-details session-large-details">
          <div className="nested-detail">
            <div className="session-detail-header">Categories:</div>
            <div className="nested-detail">
              <div className="session-detail-list-wrapper">
                {Object.keys(data.categories).map((timestamp, index) => {
                  return (
                    <div key={index} className="session-detail-list">
                      <div>{formatDate(timestamp, "time")}:</div>
                      <div>{data.categories[timestamp]}</div>
                    </div>
                  );
                })}
              </div>
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
