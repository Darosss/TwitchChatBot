import { useEffect, useState } from "react";
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
} from "@layout";
import { useParams } from "react-router-dom";
import { useEditWidget, useGetWidgetById } from "@services";
import StreamModes from "./streamModes";
import { addNotification, getInitialCurrentBreakpoint } from "@utils";
import ReactGrid from "@components/reactGrid";
import MusicPlayer from "./musicPlayer";
import RewardsWindow from "./rewardsWindow";
import { HelmetTitle } from "@components/componentWithTitle";
import { Error, Loading } from "@components/axiosHelper";

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

  const updateWidgetMutation = useEditWidget();
  const {
    data: widgetData,
    isLoading,
    error,
  } = useGetWidgetById(eventsId || "");

  useEffect(() => {
    if (!widgetData) return;
    const { data: layoutData } = widgetData;

    setLayoutWidgets(layoutData.layout);
    setToolbox(layoutData.toolbox);
  }, [widgetData]);

  if (error) return <Error error={error} />;
  if (!widgetData || isLoading) return <Loading />;
  const handleUpdateWidget = (
    layoutState: ReactGridLayout.Layouts,
    toolboxState: ReactGridLayout.Layouts
  ) => {
    if (!eventsId) {
      addNotification("Couldn't update widget", "No widget id", "warning");
      return;
    }
    setLayoutWidgets(layoutState);
    setToolbox(toolboxState);
    updateWidgetMutation.mutate({
      id: eventsId,
      updatedWidget: { layout: layoutState, toolbox: toolboxState },
    });
  };
  return (
    <div>
      <HelmetTitle title={"Events " + widgetData.data.name} />
      <ReactGrid
        layoutName={widgetData.data.name}
        layoutState={layoutWidgets}
        toolboxState={toolbox}
        currentBreakpointState={[currentBreakpoint, setCurrentBreakpoint]}
        componentsMap={components}
        onEdit={handleUpdateWidget}
        showDrawer={editor}
      ></ReactGrid>
    </div>
  );
}
