import React, { useState } from "react";
import { addSuccessNotification } from "@utils";
import { Link } from "react-router-dom";
import { initialLayoutOverlays, initialToolboxOverlays } from "src/layout";
import {
  useCreateOverlay,
  useGetOverlays,
  useRemoveOverlayById,
} from "@services";
import CardboxWrapper, {
  CardboxInput,
  CardboxItem,
} from "@components/cardboxWrapper/CardboxWrapper";
import { AxiosError, Loading } from "@components/axiosHelper";
import { useAxiosWithConfirmation } from "@hooks";

export default function OverlaysList() {
  const { data, loading, error, refetchData } = useGetOverlays();

  const [overlayName, setLayoutName] = useState<string>("");

  const { refetchData: fetchCreateLayout } = useCreateOverlay({
    name: overlayName,
    layout: initialLayoutOverlays,
    toolbox: initialToolboxOverlays,
  });

  const setOverlayIdToDelete = useAxiosWithConfirmation({
    hookToProceed: useRemoveOverlayById,
    opts: { onFullfiled: () => refetchData() },
  });

  if (error) return <AxiosError error={error} />;
  if (!data || loading) return <Loading />;

  const { data: overlays } = data;

  const createNewOverlay = () => {
    fetchCreateLayout().then(() => {
      refetchData();
      addSuccessNotification("Overlay created successfully");
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
              setOverlayIdToDelete(overlay._id);
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
