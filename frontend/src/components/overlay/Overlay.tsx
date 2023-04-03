import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import React, { useEffect, useState } from "react";
import ReactGridLayout from "react-grid-layout";

import Redemptions from "./redemptions";
import {
  initialLayoutOverlays,
  initialToolboxOverlays,
} from "src/layout/initialLayoutOverlays";
import { useParams } from "react-router-dom";
import { getInitialCurrentBreakpoint } from "@utils/layoutBreakpoints";
import ReactGrid from "@components/reactGrid";
import { editOverlayById, getOverlayById } from "@services/OverlayService";

const components = new Map([["overlay-redemptions", Redemptions]]);

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

  const { data, error } = getOverlayById(overlayId || "");
  const { refetchData: fetchEditOverlay } = editOverlayById(overlayId || "", {
    layout: layoutOverlay,
    toolbox: toolbox,
  });

  useEffect(() => {
    if (!data) return;
    const { data: layoutData } = data;

    setLayoutOverlay(layoutData.layout);
    setToolbox(layoutData.toolbox);
  }, [data]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  return (
    <div>
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
