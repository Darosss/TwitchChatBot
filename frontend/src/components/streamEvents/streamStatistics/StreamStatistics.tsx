import "./style.css";
import React, { useEffect } from "react";
import streamSessionService, {
  TopMsgsUsers,
  TopRedemptionsUsers,
  TopUsedWords,
} from "@services/StreamSessionService";
import LineChart from "@components/LineChart";
import SlideShow from "@components/SlideShow";

type SessionMessagesProps = {
  count: number;
};

type TopUsersMessagesProps = {
  users: TopMsgsUsers[];
};

type TopRedemptionProps = {
  users: TopRedemptionsUsers[];
};

type TopUsedWordsProps = {
  words: TopUsedWords[];
};

export default function StreamStatistics(props: { className?: string }) {
  const FETCH_INTERVAL = 60;
  const { className } = props;
  const {
    data: statisticsData,
    loading,
    error,
    refetchData,
  } = streamSessionService.getSessionStatistics();

  useEffect(() => {
    const statisticInterval = setInterval(() => {
      refetchData();
    }, FETCH_INTERVAL * 1000);

    return () => clearInterval(statisticInterval);
  }, []);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!statisticsData || loading) return <>Loading...</>;
  const { data } = statisticsData;

  return (
    <div
      id="stream-statistics"
      className={`stream-statistics ${className ? className : ""}`}
    >
      <div className="statistics-wrapper">
        <SessionMessages count={data.messagesCount} />
      </div>

      <div className="statistics-wrapper">
        <TopUsersMessages users={data.topMsgsUsers} />
      </div>
      <div className="statistics-wrapper">
        <MostRedemptions users={data.topRedemptionsUsers} />
      </div>
      <div className="statistics-wrapper">
        <MostUsedWords words={data.topUsedWords} />
      </div>

      <div className="statistics-wrapper statistics-graph">
        <SlideShow styleWrapper={{ width: "33vw" }}>
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
  );
}
function SessionMessages({ count }: SessionMessagesProps) {
  return (
    <>
      <div> Messages</div>
      <table className="session-statistics-msgs-count table-statistic">
        <thead>
          <tr>
            <th>Session msgs</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> {count}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function TopUsersMessages({ users }: TopUsersMessagesProps) {
  return (
    <>
      <div> Most messages</div>
      <table className="session-statistics-msgs table-statistic">
        <thead>
          <tr>
            <th>Username</th>
            <th>Messages count</th>
          </tr>
        </thead>
        {users?.map((user, index) => {
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
    </>
  );
}

function MostRedemptions({ users }: TopRedemptionProps) {
  return (
    <>
      <div>Redemptions</div>
      <table className="session-statistics-redemptions table-statistic">
        <thead>
          <tr>
            <th>Username</th>
            <th>Redemptions count</th>
            <th>Redemptions cost</th>
          </tr>
        </thead>
        {users?.map((user, index) => {
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
    </>
  );
}

function MostUsedWords({ words }: TopUsedWordsProps) {
  return (
    <>
      <div> Most words</div>
      <table className="session-statistics-words table-statistic">
        <thead>
          <tr>
            <th>Word</th>
            <th>Count</th>
          </tr>
        </thead>
        {words.map((word, index) => {
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
    </>
  );
}
