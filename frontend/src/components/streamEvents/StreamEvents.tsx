import "./style.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import React, { useEffect, useMemo, useState } from "react";
import ReactGridLayout, { Responsive, WidthProvider } from "react-grid-layout";

import StreamChat from "./streamChat";
import StreamChatters from "./streamChatters";
import StreamNotifications from "./streamNotifications";
import StreamStatistics from "./streamStatistics";
import DrawerBar from "@components/drawer/DrawerBar";
import MessagesWindow from "./messageWindow";

import {
  initialLayoutWidgets,
  initialToolboxWidgets,
} from "src/layout/initialLayoutWidgets";
import { useParams } from "react-router-dom";
import {
  editWidgetById,
  getWidgetById,
  Widgets,
} from "@services/WidgetsService";
import PreviousPage from "@components/previousPage";
import { addNotification } from "@utils/getNotificationValues";
import StreamModes from "./streamModes";

const components = new Map([
  ["stream-chat", StreamChat],
  ["stream-chatters", StreamChatters],
  ["stream-notifications", StreamNotifications],
  ["stream-statistics", StreamStatistics],
  ["messages-window", MessagesWindow],
  ["stream-modes", StreamModes],
]);

export default function StreamEvents() {
  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvider(Responsive),
    []
  );

  const { eventsId } = useParams();
  const [layoutWidgets, setLayoutWidgets] =
    useState<ReactGridLayout.Layouts>(initialLayoutWidgets);
  const [toolbox, setToolbox] = useState<ReactGridLayout.Layouts>(
    initialToolboxWidgets
  );
  const [isEdit, setIsEdit] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState(() => {
    const width = window.innerWidth;
    if (width >= 1700) return "ulg";
    else if (width >= 1200) return "lg";
    else if (width >= 996) return "md";
    else if (width >= 768) return "sm";
    else if (width >= 480) return "xs";
    else return "xxs";
  });

  const { data, loading, error } = getWidgetById(eventsId || "");
  const { refetchData: fetchEditWidgets } = editWidgetById(
    data?.data?._id || "",
    { layout: layoutWidgets, toolbox: toolbox }
  );

  useEffect(() => {
    if (!data) return;
    const { data: layoutData } = data;

    setLayoutWidgets(layoutData.layout);

    setToolbox(layoutData.toolbox);
  }, [data]);

  const onLayoutChange = (
    currLayout: ReactGridLayout.Layout[],
    allLayouts: ReactGridLayout.Layouts
  ) => {
    setLayoutWidgets((prevLayouts) => ({
      ...prevLayouts,
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
        <div
          key={item.i}
          style={{ border: !item.static ? "2px solid pink" : "" }}
        >
          {isEdit ? (
            <div
              className="widget-hide-button common-button"
              onClick={() => onPutItem(item)}
            >
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

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  return (
    <div>
      <EventsDrawerBar
        widgetsLayoutsName={data.data.name}
        toolbox={toolbox}
        currentBreakpoint={currentBreakpoint}
        onTakeItem={onTakeItem}
        setLayoutWidgets={setLayoutWidgets}
        setIsEdit={setIsEdit}
        editWidgets={fetchEditWidgets}
      />

      <ResponsiveReactGridLayout
        onLayoutChange={onLayoutChange}
        style={{ marginRight: "2rem" }}
        compactType={null}
        layouts={layoutWidgets}
        onBreakpointChange={onBreakpointChange}
        breakpoints={{ ulg: 1500, lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        preventCollision={false}
        rowHeight={30}
        cols={{ ulg: 16, lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        autoSize={true}
        margin={{
          ulg: [12, 12],
          lg: [10, 10],
          md: [8, 8],
          sm: [6, 6],
          xs: [4, 4],
          xxs: [2, 2],
        }}
      >
        {generateWidgets()}
      </ResponsiveReactGridLayout>
    </div>
  );
}

function ToolBox(props: {
  items: ReactGridLayout.Layout[];
  onTakeItem: (item: ReactGridLayout.Layout) => void;
}) {
  const { items, onTakeItem } = props;
  return (
    <>
      <div className="widgets-toolbox-title">Available widgets</div>
      <div className="widgets-toolbox">
        <div className="widgets-toolbox-items">
          {items.map((item) => (
            <ToolBoxItem key={item.i} item={item} onTakeItem={onTakeItem} />
          ))}
        </div>
      </div>
    </>
  );
}

function ToolBoxItem(props: {
  item: ReactGridLayout.Layout;
  onTakeItem: (item: ReactGridLayout.Layout) => void;
}) {
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

function EventsDrawerBar({
  widgetsLayoutsName,
  toolbox,
  currentBreakpoint,
  onTakeItem,
  setLayoutWidgets,
  setIsEdit,
  editWidgets,
}: {
  widgetsLayoutsName: string;
  toolbox: ReactGridLayout.Layouts;
  currentBreakpoint: string;
  onTakeItem: (item: ReactGridLayout.Layout) => void;
  setLayoutWidgets: React.Dispatch<
    React.SetStateAction<ReactGridLayout.Layouts>
  >;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  editWidgets: () => Promise<Widgets>;
}) {
  const [edit, setEdit] = useState(false);

  const setStaticLayout = (isStatic: boolean) => {
    setLayoutWidgets((prevLayout) => ({
      ...prevLayout,
      [currentBreakpoint]: prevLayout[currentBreakpoint].map((item) => ({
        ...item,
        static: isStatic,
      })),
    }));
  };

  const toggleStaticMode = () => {
    setStaticLayout(edit);

    setIsEdit((prevState) => {
      return !prevState;
    });

    setEdit((prevState) => {
      return !prevState;
    });
  };

  const handleOnSave = () => {
    editWidgets();
    addNotification(
      "Success",
      "Stream events layout edited successfully",
      "success"
    );
  };

  return (
    <DrawerBar direction={"top"} size={120} sticky={true} overlay={false}>
      <div className="widget-menu-drawer">
        <div className="widget-menu-drawer-toolbox">
          <ToolBox
            items={toolbox[currentBreakpoint] || []}
            onTakeItem={onTakeItem}
          />
        </div>
        <div>
          <div className="widget-header-drawer">
            <PreviousPage /> <span>{widgetsLayoutsName}</span> widgets
          </div>
          <div className="widget-edit-save">
            <div>
              Is edit:
              <span style={{ color: !edit ? "red" : "green" }}>
                {" " + edit.toString()}
              </span>
            </div>
            <div>
              <button onClick={toggleStaticMode}>Toggle Edit</button>
            </div>
            <div>
              {!edit ? <button onClick={handleOnSave}>Save</button> : null}
            </div>
          </div>
        </div>
      </div>
    </DrawerBar>
  );
}
