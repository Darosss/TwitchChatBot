import "./style.css";
import React, { useEffect, useState } from "react";
import { handleDeleteLayout } from "@utils/handleDeleteApi";
import { addNotification } from "@utils/getNotificationValues";
import { Link } from "react-router-dom";
import {
  initialLayoutOverlays,
  initialToolboxOverlays,
} from "src/layout/initialLayoutOverlays";
import {
  createOverlay,
  getOverlays,
  Overlay,
  removeOverlayById,
} from "@services/OverlayService";

export default function OverlaysList() {
  const { data, loading, error, refetchData } = getOverlays();

  const [overlayName, setLayoutName] = useState<string>("");

  const [overlayIdDelete, setLayoutIdDelete] = useState<string | null>(null);

  const { refetchData: fetchCreateLayout } = createOverlay({
    name: overlayName,
    layout: initialLayoutOverlays,
    toolbox: initialToolboxOverlays,
  });

  const { refetchData: fetchDeleteLayout } = removeOverlayById(
    overlayIdDelete ? overlayIdDelete : ""
  );

  useEffect(() => {
    handleDeleteLayout<Overlay>(overlayIdDelete, setLayoutIdDelete, () => {
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
      <div className="overlays-wrapper">
        <div className="overlays-header">Overlays</div>
        <div className="overlays-list">
          <div className="overlays-btn">
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
          </div>
          {overlays.map((overlay, index) => {
            return (
              <div key={index} className="widget-overlays-div">
                <button
                  onClick={() => setLayoutIdDelete(overlay._id)}
                  className="common-button danger-button remove-overlay-btn"
                >
                  X
                </button>
                <Link to={`${overlay._id}`}>{overlay.name}</Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
