import "./style.css";
import React from "react";
import { useParams } from "react-router-dom";
import TwitchSessionService from "src/services/Twitch-session.service";
import formatDate from "@utils/formatDate";
import LineChart from "@components/LineChart";
import PreviousPage from "@components/PreviousPage";
import SlideShow from "@components/SlideShow";

export default function TwitchSessionDetail() {
  const { sessionId } = useParams();

  const {
    data: sessionData,
    loading,
    error,
  } = TwitchSessionService.getSessionById(sessionId || "null");

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!sessionData || loading) return <>Loading!</>;

  const { data } = sessionData;
  console.log(sessionData.data);
  return (
    <>
      <PreviousPage />
      <div className="twitch-session-details-wrapper">
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
              <ul>
                {data.sessionTitles.map((title, index) => {
                  return <li key={index}>{title}</li>;
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="session-categories-details session-large-details">
          <div className="nested-detail">
            <div className="session-detail-header">Categories:</div>
            <div className="nested-detail">
              <ul>
                {data.categories.map((category, index) => {
                  return <li key={index}>{category}</li>;
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="session-graphs-details session-large-details">
          <div className="nested-detail">
            <div className="nested-detail">
              <SlideShow styleWrapper={{ width: "37vmax" }}>
                <LineChart
                  data={data.viewers}
                  chartOptions={{ title: "Viewers peek", label: "viewers" }}
                />
                <LineChart
                  data={data.viewers}
                  chartOptions={{ title: "Viewers peek", label: "viewers" }}
                />
                <LineChart
                  data={data.viewers}
                  chartOptions={{ title: "Viewers peek", label: "viewers" }}
                />
                <LineChart
                  data={data.viewers}
                  chartOptions={{ title: "Viewers peek", label: "viewers" }}
                />
              </SlideShow>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
