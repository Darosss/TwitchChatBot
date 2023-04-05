import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import React, { useEffect, useState } from "react";
import ReactGridLayout from "react-grid-layout";

import StreamChat from "./streamChat";
import StreamChatters from "./streamChatters";
import StreamNotifications from "./streamNotifications";
import StreamStatistics from "./streamStatistics";
import MessagesWindow from "./messageWindow";

import {
  initialLayoutWidgets,
  initialToolboxWidgets,
} from "src/layout/initialLayoutWidgets";
import { useParams } from "react-router-dom";
import { editWidgetById, getWidgetById } from "@services/WidgetsService";
import StreamModes from "./streamModes";
import { getInitialCurrentBreakpoint } from "@utils/layoutBreakpoints";
import ReactGrid from "@components/reactGrid";
import MusicPlayer from "./musicPlayer";

const components = new Map([
  ["stream-chat", StreamChat],
  ["stream-chatters", StreamChatters],
  ["stream-notifications", StreamNotifications],
  ["stream-statistics", StreamStatistics],
  ["messages-window", MessagesWindow],
  ["stream-modes", StreamModes],
  ["music-player", MusicPlayer],
]);

export default function StreamEvents(params: { editor?: boolean }) {
  const { editor = false } = params;
  const { eventsId } = useParams();
  const [layoutWidgets, setLayoutWidgets] =
    useState<ReactGridLayout.Layouts>(initialLayoutWidgets);
  const [toolbox, setToolbox] = useState<ReactGridLayout.Layouts>(
    initialToolboxWidgets
  );
  const [currentBreakpoint, setCurrentBreakpoint] = useState(
    getInitialCurrentBreakpoint()
  );

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

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  return (
    <div>
      <ReactGrid
        layoutName={data.data.name}
        layoutState={[layoutWidgets, setLayoutWidgets]}
        toolboxState={[toolbox, setToolbox]}
        currentBreakpointState={[currentBreakpoint, setCurrentBreakpoint]}
        componentsMap={components}
        onEdit={fetchEditWidgets}
        showDrawer={editor}
      ></ReactGrid>
    </div>
  );
}
