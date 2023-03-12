import "./style.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import React, { useMemo, useState } from "react";
import ReactGridLayout, { Responsive, WidthProvider } from "react-grid-layout";

import StreamChat from "./streamChat";
import StreamChatters from "./streamChatters";
import StreamNotifications from "./streamNotifications";
import StreamStatistics from "./streamStatistics";
import DrawerBar from "@components/drawer/DrawerBar";

const components = new Map([
  ["stream-chat", StreamChat],
  ["stream-chatters", StreamChatters],
  ["stream-notifications", StreamNotifications],
  ["stream-statistics", StreamStatistics],
]);

export default function StreamEvents(props: {
  initialLayouts: ReactGridLayout.Layouts;
}) {
  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvider(Responsive),
    []
  );

  const [isEdit, setIsEdit] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState("ulg");
  const [layoutWidgets, setLayoutWidgets] = useState(props.initialLayouts);

  const [toolbox, setToolbox] = useState<ReactGridLayout.Layouts>({
    ulg: [],
    lg: [],
    md: [],
    sm: [],
    xs: [],
    xxs: [],
  });

  const toggleStaticMode = () => {
    setIsEdit(!isEdit);
    setLayoutWidgets((prevLayout) => ({
      ...prevLayout,
      lg: prevLayout.lg.map((item) => ({
        ...item,
        static: !item.static,
      })),
    }));
  };

  const onLayoutChange = (
    currLayout: ReactGridLayout.Layout[],
    allLayouts: ReactGridLayout.Layouts
  ) => {
    setLayoutWidgets((prevLayout) => ({
      ...prevLayout,
      [currentBreakpoint]: currLayout,
    }));
  };

  const onBreakpointChange = (breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);

    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      [breakpoint]:
        prevToolbox[breakpoint] || [prevToolbox.currentBreakpoint] || [],
    }));
  };

  const onTakeItem = (item: ReactGridLayout.Layout) => {
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      [currentBreakpoint]: prevToolbox[currentBreakpoint].filter(
        ({ i }) => i !== item.i
      ),
    }));

    setLayoutWidgets((prevLayout) => ({
      ...prevLayout,
      [currentBreakpoint]: [...prevLayout[currentBreakpoint], item],
    }));
  };

  const onPutItem = (item: ReactGridLayout.Layout) => {
    setToolbox((prevToolbox) => ({
      ...prevToolbox,
      [currentBreakpoint]: [...(prevToolbox[currentBreakpoint] || []), item],
    }));

    setLayoutWidgets((prevLayout) => ({
      ...prevLayout,
      [currentBreakpoint]: prevLayout[currentBreakpoint].filter(
        ({ i }) => i !== item.i
      ),
    }));
  };

  const generateWidgets = () => {
    return layoutWidgets[currentBreakpoint].map((item) => {
      const MapComponent = components.get(item.i);
      if (!MapComponent) return null;
      return (
        <div key={item.i}>
          {isEdit ? (
            <div className="widget-hide-button" onClick={() => onPutItem(item)}>
              &times;
            </div>
          ) : null}
          <span>
            <MapComponent />
          </span>
        </div>
      );
    });
  };

  return (
    <div>
      <DrawerBar direction={"top"} size={120} showBtnText="&#8595;">
        <div className="widget-menu-drawer">
          <div className="widget-menu-drawer-toolbox">
            <ToolBox
              items={toolbox[currentBreakpoint] || []}
              onTakeItem={onTakeItem}
            />
          </div>
          <div>
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
        </div>
      </DrawerBar>

      <ResponsiveReactGridLayout
        onLayoutChange={onLayoutChange}
        compactType={null}
        layouts={layoutWidgets}
        onBreakpointChange={onBreakpointChange}
        breakpoints={{ ulg: 1700, lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        preventCollision={false}
        rowHeight={30}
        cols={{ ulg: 16, lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        autoSize={true}
        margin={{
          lg: [10, 10],
          md: [10, 10],
          sm: [10, 10],
          xs: [10, 10],
          xxs: [10, 10],
        }}
      >
        {generateWidgets()}
      </ResponsiveReactGridLayout>
    </div>
  );
}

function ToolBox(props: { items: any; onTakeItem: any }) {
  const { items, onTakeItem } = props;
  return (
    <>
      <div className="widgets-toolbox-title">Available widgets</div>
      <div className="widgets-toolbox">
        <div className="widgets-toolbox-items">
          {items.map((item: ReactGridLayout.Layout) => (
            <ToolBoxItem key={item.i} item={item} onTakeItem={onTakeItem} />
          ))}
        </div>
      </div>
    </>
  );
}

function ToolBoxItem(props: { item: any; onTakeItem: any }) {
  const { item, onTakeItem } = props;
  return (
    <div
      className="widgets-items-item"
      onClick={onTakeItem.bind(undefined, item)}
    >
      {item.i.replace("-", " ")}
    </div>
  );
}
