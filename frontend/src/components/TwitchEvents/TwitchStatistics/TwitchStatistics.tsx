import "./style.css";
import React, { useContext, useEffect, useReducer, useState } from "react";
import TwitchSessionService from "src/services/Twitch-session.service";

export default function TwitchNotifications(props: { className?: string }) {
  const { className } = props;
  const {
    data: statisticsData,
    loading,
    error,
  } = TwitchSessionService.getSessionStatistics();

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!statisticsData || loading) return <>Loading...</>;

  const { data } = statisticsData;

  return (
    <div
      id="twitch-statistics"
      className={`twitch-statistics ${className ? className : ""}`}
    >
      <div>
        <table className="session-statistics-msgs-count table-statistic">
          <thead>
            <tr>
              <th>Session msgs</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td> {data.messagesCount}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <table className="session-statistics-msgs table-statistic">
          <thead>
            <tr>
              <th>Username</th>
              <th>Messages count</th>
            </tr>
          </thead>
          {data.topMsgsUsers?.map((user, index) => {
            return (
              <tbody key={user._id + index}>
                <tr>
                  <td> {user.username}</td>
                  <td> {user.messageCount}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
      <div>
        <table className="session-statistics-redemptions table-statistic">
          <thead>
            <tr>
              <th>Username</th>
              <th>Redemptions count</th>
              <th>Redemptions cost</th>
            </tr>
          </thead>
          {data.topRedemptionsUsers?.map((user, index) => {
            return (
              <tbody key={user._id + index}>
                <tr>
                  <td> {user.username}</td>
                  <td> {user.redemptionsCount}</td>
                  <td> {user.redemptionsCost}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
      <div>
        <table className="session-statistics-words table-statistic">
          <thead>
            <tr>
              <th>Username</th>
              <th>Redemptions count</th>
            </tr>
          </thead>
          {data.topUsedWords?.map((word, index) => {
            return (
              <tbody key={word._id + index}>
                <tr>
                  <td> {word._id}</td>
                  <td> {word.count}</td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
}
