import { useEffect, useState } from "react";
import Redemptions from "./redemptions";
import { overlaysKeys } from "@layout";
import { addNotification, getInitialCurrentBreakpoint } from "@utils";
import ReactGrid from "@components/reactGrid";
import MusicPlayer from "./musicPlayer";
import { HelmetTitle } from "@components/componentWithTitle";
import Achievements from "./achievements";
import Chat from "./chat";
import PreviewImageSelector from "./PreviewImageSelector";
import StyleCSSEditor from "./StyleCSSEditor";
import { useSocketContext } from "@socket";
import {
  useEditOverlay,
  useGetOverlayById,
  useRefetchOverlayById,
} from "@services";
import { useDispatch, useSelector } from "react-redux";
import {
  setId,
  setIsEditor,
  setLayout,
  setOverlayState,
  setToolbox,
} from "@redux/overlaysSlice";
import { RootStore } from "@redux/store";
import { useParams } from "react-router-dom";
import { Error, Loading } from "@components/axiosHelper";

const components = new Map([
  [overlaysKeys.overlayRedemptions, Redemptions],
  [overlaysKeys.overlayMusicPlayer, MusicPlayer],
  [overlaysKeys.overlayAchievements, Achievements],
  [overlaysKeys.overlayChat, Chat],
]);

export default function Overlay(params: { editor?: boolean }) {
  const { editor = false } = params;
  const { overlayId } = useParams();
  const {
    events: { refreshOverlayLayout: refreshOverlayLayoutEvent },
  } = useSocketContext();
  const dispatch = useDispatch();

  const overlaysStateRedux = useSelector((state: RootStore) => state.overlays);
  const { isEditor, overlay: overlayState } = overlaysStateRedux;

  const [currentBreakpoint, setCurrentBreakpoint] = useState(
    getInitialCurrentBreakpoint()
  );
  const editOverlayMutation = useEditOverlay();

  //Note: Overlay is in route where overlayId should be.
  const { data: overlayData, isLoading, error } = useGetOverlayById(overlayId!);
  const refetchOverlayById = useRefetchOverlayById();

  useEffect(() => {
    if (!overlayId) {
      addNotification(
        "No overlay id",
        "Something went wrong, no overlay id",
        "warning"
      );
      return;
    }
    dispatch(setId(overlayId));
  }, [dispatch, overlayId]);

  useEffect(() => {
    dispatch(setIsEditor(editor));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  useEffect(() => {
    refreshOverlayLayoutEvent.on((id) => {
      refetchOverlayById(id);
    });

    return () => {
      refreshOverlayLayoutEvent.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshOverlayLayoutEvent]);

  useEffect(() => {
    if (!overlayData) return;

    dispatch(setOverlayState(overlayData.data));

    dispatch(setId(overlayData.data._id));
  }, [overlayData, dispatch]);

  if (error) return <Error error={error} />;
  if (isLoading || !overlayData) return <Loading />;

  const handleOnEditOverlay = (
    layoutState: ReactGridLayout.Layouts,
    toolboxState: ReactGridLayout.Layouts
  ) => {
    if (!overlayId) {
      addNotification("Couldn't update overlay", "No overlay id", "warning");
      return;
    }
    dispatch(setLayout(layoutState));
    dispatch(setToolbox(toolboxState));
    editOverlayMutation.mutate({
      id: overlayId,
      updatedOverlay: {
        layout: layoutState,
        toolbox: toolboxState,
      },
    });
  };
  return (
    <div>
      <HelmetTitle title={"Overlay " + overlayState.name} />
      {editor ? (
        <>
          <StyleCSSEditor />
          <PreviewImageSelector />
        </>
      ) : null}
      <ReactGrid
        layoutName={overlayState.name}
        layoutState={overlayState.layout}
        toolboxState={overlayState.toolbox}
        currentBreakpointState={[currentBreakpoint, setCurrentBreakpoint]}
        componentsMap={components}
        onEdit={handleOnEditOverlay}
        showDrawer={isEditor}
      />
    </div>
  );
}
