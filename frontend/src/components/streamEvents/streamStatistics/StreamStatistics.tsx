import "./style.css";
import React, { useEffect, useState } from "react";

import { Responsive, WidthProvider } from "react-grid-layout";

import {
  getCurrentSessionStatistics,
  ITopMsgsUsers,
  ITopRedemptionsUsers,
  ITopUsedWords,
} from "@services/StreamSessionService";
import LineChart from "@components/lineChart";
import SlideShow from "@components/slideShow";
import DrawerBar from "@components/drawer";

type SessionMessagesProps = {
  count: number;
};

type TopUsersMessagesProps = {
  users: ITopMsgsUsers[];
};

type TopRedemptionProps = {
  users: ITopRedemptionsUsers[];
};

type TopUsedWordsProps = {
  words: ITopUsedWords[];
};

type ViewersPeek = {
  viewers: Map<string, number>;
};

const ResponsiveReactGridLayout = WidthProvider(Responsive);
export default function StreamStatistics() {
  const FETCH_INTERVAL = 60;
  const [isEdit, setIsEdit] = useState(false);
  const [layoutsGrid, setLayouts] = useState<ReactGridLayout.Layouts>({
    lg: [
      { i: "session-messages", x: 0, y: 0, w: 1, h: 2, static: true },
      { i: "session-top-messages", x: 1, y: 0, w: 2, h: 2, static: true },
      { i: "session-top-redemptions", x: 3, y: 0, w: 2, h: 2, static: true },
      { i: "session-top-words", x: 5, y: 0, w: 2, h: 2, static: true },
      { i: "session-viewers-peek", x: 0, y: 2, w: 5, h: 4, static: true },
    ],
  });

  function toggleStaticMode() {
    setIsEdit(!isEdit);
    setLayouts((prevLayout) => ({
      ...prevLayout,
      lg: prevLayout.lg.map((item) => ({
        ...item,
        static: !item.static,
      })),
    }));
  }

  const onLayoutChange = (
    layouts: ReactGridLayout.Layout[],
    layout: ReactGridLayout.Layouts
  ) => {
    setLayouts(layout);
  };

  const {
    data: statisticsData,
    loading,
    error,
    refetchData,
  } = getCurrentSessionStatistics();

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
    <div className="stream-statistics">
      <DrawerBar direction={"top"} size={60} showBtnText="&#8595;">
        <div className="widget-statistics-menu-drawer">
          <div>
            <button onClick={toggleStaticMode}>Toggle Edit</button>
          </div>
          <div>
            Is edit:
            <span style={{ color: !isEdit ? "red" : "green" }}>
              {isEdit.toString()}
            </span>
          </div>
          <div>
            <button>Save</button>
          </div>
        </div>
      </DrawerBar>
      <ResponsiveReactGridLayout
        onLayoutChange={onLayoutChange}
        compactType={"vertical"}
        layouts={layoutsGrid}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        preventCollision={true}
        rowHeight={70}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        autoSize={true}
        margin={{
          lg: [10, 5],
          md: [10, 10],
          sm: [10, 10],
          xs: [10, 10],
          xxs: [10, 10],
        }}
      >
        <div key="session-messages">
          <SessionMessages count={data.messagesCount} />
        </div>
        <div key="session-top-messages">
          <TopUsersMessages users={data.topMsgsUsers} />
        </div>
        <div key="session-top-redemptions">
          <MostRedemptions users={data.topRedemptionsUsers} />
        </div>
        <div key="session-top-words">
          <MostUsedWords words={data.topUsedWords} />
        </div>
        <div key="session-viewers-peek">
          <div className="statistics-graph">
            <SlideShow styleWrapper={{ width: "100%" }}>
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
      </ResponsiveReactGridLayout>
    </div>
  );
}
function SessionMessages({ count }: SessionMessagesProps) {
  return (
    <div className="session-statistic session-messages">
      <div> Messages</div>
      <div className="stats-wrapper stats-header">
        <div>Session Messages</div>
      </div>
      <div className="stats-wrapper">
        <div className="statistic-full"> {count}</div>
      </div>
    </div>
  );
}

function TopUsersMessages({ users }: TopUsersMessagesProps) {
  return (
    <div className="session-statistic session-top-messages">
      <div> Most messages</div>
      <div className="stats-wrapper stats-header">
        <div className="statistic-long">User</div>
        <div className="statistic-short">Count</div>
      </div>
      {users?.map((user, index) => {
        return (
          <div key={index} className="stats-wrapper">
            <div className="statistic-long"> {user.username}</div>
            <div className="statistic-short"> {user.messageCount}</div>
          </div>
        );
      })}
    </div>
  );
}

function MostRedemptions({ users }: TopRedemptionProps) {
  return (
    <div className="session-statistic session-top-redemptions">
      <div>Redemptions</div>
      <div className="stats-wrapper stats-header">
        <div className="statistic-long">Username</div>
        <div className="statistic-short">Count</div>
        <div className="statistic-short">Cost</div>
      </div>

      {users?.map((user, index) => {
        return (
          <div key={index} className="stats-wrapper">
            <div className="statistic-long"> {user.username}</div>
            <div className="statistic-short"> {user.redemptionsCount}</div>
            <div className="statistic-short"> {user.redemptionsCost}</div>
          </div>
        );
      })}
    </div>
  );
}

function MostUsedWords({ words }: TopUsedWordsProps) {
  return (
    <div className="session-statistic session-top-words">
      <div> Most words</div>
      <div className="stats-wrapper stats-header">
        <div className="statistic-long">Word</div>
        <div className="statistic-short"> Count</div>
      </div>
      {words.map((word, index) => {
        return (
          <div key={index} className="stats-wrapper">
            <div className="statistic-long">{word._id}</div>
            <div className="statistic-short">{word.count}</div>
          </div>
        );
      })}
    </div>
  );
}

function StreamViewersPeek({ viewers }: ViewersPeek) {
  return (
    <div key="session-viewers-peek" data-grid={{ x: 5, y: 0, w: 3, h: 3 }}>
      <div className="statistics-graph">
        <SlideShow styleWrapper={{ width: "33vw" }}>
          <LineChart
            data={viewers}
            chartOptions={{ title: "Viewers peek", label: "viewers" }}
          />
        </SlideShow>
      </div>
    </div>
  );
}
