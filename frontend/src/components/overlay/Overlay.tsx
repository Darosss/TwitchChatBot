import React, { useEffect, useState } from "react";
import Redemptions from "./redemptions";
import { overlaysKeys } from "src/layout/initialLayoutOverlays";
import { getInitialCurrentBreakpoint } from "@utils";
import ReactGrid from "@components/reactGrid";
import MusicPlayer from "./musicPlayer";
import YoutubePlayerVideo from "./youtubePlayerVideo";
import { HelmetTitle } from "@components/componentWithTitle";
import Achievements from "./achievements";
import Chat from "./chat";
import PreviewImageSelector from "./PreviewImageSelector";
import { useOverlayDataContext } from "./OverlayDataContext";
import StyleCSSEditor from "./StyleCSSEditor";
import { useSocketContext } from "@socket";

const components = new Map([
  [overlaysKeys.overlayRedemptions, Redemptions],
  [overlaysKeys.overlayMusicPlayer, MusicPlayer],
  [overlaysKeys.overlayYoutubeMusicPlayer, YoutubePlayerVideo],
  [overlaysKeys.overlayAchievements, Achievements],
  [overlaysKeys.overlayChat, Chat],
]);

export default function Overlay(params: { editor?: boolean }) {
  const { editor = false } = params;
  const {
    emits: { refreshOverlayLayout },
    events: { refreshOverlayLayout: refreshOverlayLayoutEvent },
  } = useSocketContext();
  const {
    layoutState,
    toolboxState,
    baseData,
    fetchEditOverlay,
    fetchRefreshData,
    isEditorState: [, setIsEditor],
  } = useOverlayDataContext();

  const [currentBreakpoint, setCurrentBreakpoint] = useState(
    getInitialCurrentBreakpoint()
  );

  useEffect(() => {
    setIsEditor(editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  useEffect(() => {
    refreshOverlayLayoutEvent.on((id) => {
      if (baseData._id !== id) return;
      fetchRefreshData();
    });

    return () => {
      refreshOverlayLayoutEvent.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshOverlayLayoutEvent, baseData]);

  return (
    <div>
      <HelmetTitle title={"Overlay " + baseData.name} />
      {editor ? (
        <>
          <StyleCSSEditor />
          <PreviewImageSelector />
        </>
      ) : null}
      <ReactGrid
        layoutName={baseData.name}
        layoutState={layoutState}
        toolboxState={toolboxState}
        currentBreakpointState={[currentBreakpoint, setCurrentBreakpoint]}
        componentsMap={components}
        onEdit={() =>
          fetchEditOverlay().then(() => refreshOverlayLayout(baseData._id))
        }
        showDrawer={editor}
      />
    </div>
  );
}
