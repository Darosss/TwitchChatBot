import React, { useEffect, useState } from "react";
import ReactGridLayout from "react-grid-layout";

import Redemptions from "./redemptions";
import {
  initialLayoutOverlays,
  initialToolboxOverlays,
  overlaysKeys,
} from "src/layout/initialLayoutOverlays";
import { useParams } from "react-router-dom";
import { getInitialCurrentBreakpoint } from "@utils/layoutBreakpoints";
import ReactGrid from "@components/reactGrid";
import {
  useEditOverlayById,
  useGetOverlayById,
} from "@services/OverlayService";
import MusicPlayer from "./musicPlayer";
import YoutubePlayerVideo from "./youtubePlayerVideo";
import { HelmetTitle } from "@components/componentWithTitle";

const components = new Map([
  [overlaysKeys.overlayMusicPlayer, Redemptions],
  [overlaysKeys.overlayMusicPlayer, MusicPlayer],
  [overlaysKeys.overlayYoutubeMusicPlayer, YoutubePlayerVideo],
]);

export default function Overlay(params: { editor?: boolean }) {
  const { editor = false } = params;
  const { overlayId } = useParams();
  const [layoutOverlay, setLayoutOverlay] = useState<ReactGridLayout.Layouts>(
    initialLayoutOverlays
  );
  const [toolbox, setToolbox] = useState<ReactGridLayout.Layouts>(
    initialToolboxOverlays
  );
  const [currentBreakpoint, setCurrentBreakpoint] = useState(
    getInitialCurrentBreakpoint()
  );

  const { data, error } = useGetOverlayById(overlayId || "");
  const { refetchData: fetchEditOverlay } = useEditOverlayById(
    overlayId || "",
    {
      layout: layoutOverlay,
      toolbox: toolbox,
    }
  );

  useEffect(() => {
    if (!data) return;
    const { data: layoutData } = data;

    setLayoutOverlay(layoutData.layout);
    setToolbox(layoutData.toolbox);
  }, [data]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  return (
    <div>
      <HelmetTitle title={"Overlay " + data?.data.name || "Overlay"} />
      <ReactGrid
        layoutName={data?.data.name || ""}
        layoutState={[layoutOverlay, setLayoutOverlay]}
        toolboxState={[toolbox, setToolbox]}
        currentBreakpointState={[currentBreakpoint, setCurrentBreakpoint]}
        componentsMap={components}
        onEdit={fetchEditOverlay}
        showDrawer={editor}
      ></ReactGrid>
    </div>
  );
}
