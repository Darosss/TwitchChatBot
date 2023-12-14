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
  widgetsKeys,
} from "src/layout";
import { useParams } from "react-router-dom";
import { useEditWidgetById, useGetWidgetById } from "@services";
import StreamModes from "./streamModes";
import { getInitialCurrentBreakpoint } from "@utils";
import ReactGrid from "@components/reactGrid";
import MusicPlayer from "./musicPlayer";
import RewardsWindow from "./rewardsWindow";
import { HelmetTitle } from "@components/componentWithTitle";
import { AxiosError, Loading } from "@components/axiosHelper";

const components = new Map([
  [widgetsKeys.streamChat, StreamChat],
  [widgetsKeys.streamChatters, StreamChatters],
  [widgetsKeys.streamNotifications, StreamNotifications],
  [widgetsKeys.streamStatistics, StreamStatistics],
  [widgetsKeys.messagesWindow, MessagesWindow],
  [widgetsKeys.streamModes, StreamModes],
  [widgetsKeys.musicPlayer, MusicPlayer],
  [widgetsKeys.rewardsWindow, RewardsWindow],
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

  const { data, loading, error } = useGetWidgetById(eventsId || "");
  const { refetchData: fetchEditWidgets } = useEditWidgetById(
    data?.data?._id || "",
    { layout: layoutWidgets, toolbox: toolbox }
  );

  useEffect(() => {
    if (!data) return;
    const { data: layoutData } = data;

    setLayoutWidgets(layoutData.layout);
    setToolbox(layoutData.toolbox);
  }, [data]);

  if (error) return <AxiosError error={error} />;
  if (!data || loading) return <Loading />;

  return (
    <div>
      <HelmetTitle title={"Events " + data.data.name} />
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
