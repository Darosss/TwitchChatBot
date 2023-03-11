import "./style.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import React, { useState } from "react";
import ReactGridLayout, { Responsive, WidthProvider } from "react-grid-layout";

import StreamChat from "./streamChat";
import StreamChatters from "./streamChatters";
import StreamNotifications from "./streamNotifications";
import StreamStatistics from "./streamStatistics";
import DrawerBar from "@components/drawer/DrawerBar";

const ResponsiveReactGridLayout = WidthProvider(Responsive);
export default function StreamEvents() {
  const [isEdit, setIsEdit] = useState(false);
  const [layoutWidgets, setLayoutWidgets] = useState<ReactGridLayout.Layouts>({
    lg: [
      { i: "stream-chat", x: 0, y: 0, w: 3, h: 12, static: true },
      { i: "stream-chatters", x: 3, y: 0, w: 2, h: 12, static: true },
      { i: "stream-notifications", x: 0, y: 12, w: 4, h: 12, static: true },
      { i: "stream-statistics", x: 11, y: 0, w: 7, h: 12, static: true },
    ],
  });

  function toggleStaticMode() {
    setIsEdit(!isEdit);
    setLayoutWidgets((prevLayout) => ({
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
    setLayoutWidgets(layout);
  };

  return (
    <div>
      <DrawerBar direction={"top"} size={60} showBtnText="&#8595;">
        <div className="widget-menu-drawer">
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
        compactType={null}
        layouts={layoutWidgets}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        preventCollision={false}
        rowHeight={30}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        autoSize={true}
        margin={{
          lg: [10, 10],
          md: [10, 10],
          sm: [10, 10],
          xs: [10, 10],
          xxs: [10, 10],
        }}
      >
        <div key="stream-chat">
          <StreamChat />
        </div>
        <div key="stream-chatters">
          <StreamChatters />
        </div>
        <div key="stream-notifications">
          <StreamNotifications />
        </div>
        <div key="stream-statistics">
          <StreamStatistics />
        </div>
      </ResponsiveReactGridLayout>
    </div>
  );
}
