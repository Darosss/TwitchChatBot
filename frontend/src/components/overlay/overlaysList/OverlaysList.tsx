import React, { useEffect, useState } from "react";
import { handleActionOnChangeState } from "@utils/handleDeleteApi";
import { addNotification } from "@utils/getNotificationValues";
import { Link } from "react-router-dom";
import {
  initialLayoutOverlays,
  initialToolboxOverlays,
} from "src/layout/initialLayoutOverlays";
import {
  useCreateOverlay,
  useGetOverlays,
  useRemoveOverlayById,
} from "@services/OverlayService";
import CardboxWrapper, {
  CardboxInput,
  CardboxItem,
} from "@components/cardboxWrapper/CardboxWrapper";

export default function OverlaysList() {
  const { data, loading, error, refetchData } = useGetOverlays();

  const [overlayName, setLayoutName] = useState<string>("");

  const [overlayIdDelete, setLayoutIdDelete] = useState<string | null>(null);

  const { refetchData: fetchCreateLayout } = useCreateOverlay({
    name: overlayName,
    layout: initialLayoutOverlays,
    toolbox: initialToolboxOverlays,
  });

  const { refetchData: fetchDeleteLayout } = useRemoveOverlayById(
    overlayIdDelete ? overlayIdDelete : ""
  );

  useEffect(() => {
    handleActionOnChangeState(overlayIdDelete, setLayoutIdDelete, () => {
      fetchDeleteLayout().then(() => {
        refetchData();

        addNotification(
          "Deleted",
          "Stream events overlay removed successfully",
          "danger"
        );
        setLayoutIdDelete(null);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overlayIdDelete]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  const { data: overlays } = data;

  const createNewOverlay = () => {
    fetchCreateLayout().then(() => {
      refetchData();
      addNotification("Success", "Overlay created successfully", "success");
    });
  };

  return (
    <>
      <CardboxWrapper title={"Overlays list"}>
        <CardboxInput title="Create overlay">
          <input
            type="text"
            placeholder="Name"
            value={overlayName}
            onChange={(e) => setLayoutName(e.target.value)}
          ></input>
          <button
            onClick={() => createNewOverlay()}
            className="common-button primary-button"
          >
            Create
          </button>
        </CardboxInput>
        {overlays.map((overlay, index) => (
          <CardboxItem
            title={overlay.name}
            onClickX={() => {
              setLayoutIdDelete(overlay._id);
            }}
            key={index}
          >
            <Link
              className="common-button primary-button"
              to={`${overlay._id}`}
            >
              Show
            </Link>
            <Link
              className="common-button primary-button"
              to={`${overlay._id}/editor`}
            >
              Edit
            </Link>
          </CardboxItem>
        ))}
      </CardboxWrapper>
    </>
  );
}
