import React, { useEffect } from "react";

import {
  useGetCurrentSessionStatistics,
  TopMsgsUsers,
  TopRedemptionsUsers,
  TopUsedWords,
} from "@services";
import LineChart from "@components/lineChart";
import SlideShow from "@components/slideShow";
import { AxiosError, Loading } from "@components/axiosHelper";

interface SessionMessagesProps {
  count: number;
}

interface TopUsersMessagesProps {
  users: TopMsgsUsers[];
}

interface TopRedemptionProps {
  users: TopRedemptionsUsers[];
}

interface TopUsedWordsProps {
  words: TopUsedWords[];
}

interface ViewersPeek {
  viewers: Map<string, number>;
}

export default function StreamStatistics() {
  const FETCH_INTERVAL = 60;
  const {
    data: statisticsData,
    loading,
    error,
    refetchData,
  } = useGetCurrentSessionStatistics();

  useEffect(() => {
    const statisticInterval = setInterval(() => {
      refetchData();
    }, FETCH_INTERVAL * 1000);

    return () => clearInterval(statisticInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <AxiosError error={error} />;
  if (!statisticsData || loading) return <Loading />;
  const { data } = statisticsData;
  return (
    <div className="session-statistics-wrapper">
      <div>
        <SessionMessages count={data.messagesCount} />
      </div>
      <div>
        <TopUsersMessages users={data.topMsgsUsers} />
      </div>

      <div>
        <MostRedemptions users={data.topRedemptionsUsers} />
      </div>
      <div>
        <MostUsedWords words={data.topUsedWords} />
      </div>
      <div>
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
export function SessionMessages({ count }: SessionMessagesProps) {
  return (
    <div className="session-statistic session-messages">
      <div> Messages</div>
      <div className="stats-wrapper stats-header">Session Messages</div>
      <div className="stats-wrapper">
        <div className="statistic-full"> {count}</div>
      </div>
    </div>
  );
}

export function TopUsersMessages({ users }: TopUsersMessagesProps) {
  return (
    <div className="session-statistic session-top-messages">
      <div> Most messages</div>
      <div className="stats-wrapper stats-header">
        <div className="statistic-long">User</div>
        <div className="statistic-short">Count</div>
      </div>
      {users?.map((user, index) => (
        <div key={index} className="stats-wrapper">
          <div className="statistic-long"> {user.username}</div>
          <div className="statistic-short"> {user.messageCount}</div>
        </div>
      ))}
    </div>
  );
}

export function MostRedemptions({ users }: TopRedemptionProps) {
  return (
    <div className="session-statistic session-top-redemptions">
      <div>Redemptions</div>
      <div className="stats-wrapper stats-header">
        <div className="statistic-long">Username</div>
        <div className="statistic-short">Count</div>
        <div className="statistic-short">Cost</div>
      </div>

      {users?.map((user, index) => (
        <div key={index} className="stats-wrapper">
          <div className="statistic-long"> {user.username}</div>
          <div className="statistic-short"> {user.redemptionsCount}</div>
          <div className="statistic-short"> {user.redemptionsCost}</div>
        </div>
      ))}
    </div>
  );
}

export function MostUsedWords({ words }: TopUsedWordsProps) {
  return (
    <div className="session-statistic session-top-words">
      <div> Most words</div>
      <div className="stats-wrapper stats-header">
        <div className="statistic-long">Word</div>
        <div className="statistic-short"> Count</div>
      </div>
      {words.map((word, index) => (
        <div key={index} className="stats-wrapper">
          <div className="statistic-long">{word._id}</div>
          <div className="statistic-short">{word.count}</div>
        </div>
      ))}
    </div>
  );
}

export function StreamViewersPeek({ viewers }: ViewersPeek) {
  return (
    <div className="statistics-graph">
      <SlideShow styleWrapper={{ width: "100%" }}>
        <LineChart
          data={viewers}
          chartOptions={{ title: "Viewers peek", label: "viewers" }}
        />
      </SlideShow>
    </div>
  );
}
