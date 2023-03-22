import "./style.css";
import React, { useEffect, useState } from "react";
import {
  createLayout,
  getWidgets,
  Widgets,
  removeWidgetById,
} from "@services/WidgetsService";
import { Link } from "react-router-dom";
import {
  initialLayoutWidgets,
  initialToolboxWidgets,
} from "src/layout/initialLayoutWidgets";
import { handleDeleteLayout } from "@utils/handleDeleteApi";
import { addNotification } from "@utils/getNotificationValues";

export default function StreamNotifications() {
  const { data, loading, error, refetchData } = getWidgets();

  const [layoutName, setLayoutName] = useState<string>("");

  const [layoutIdToDelete, setLayoutIdToDelete] = useState<string | null>(null);

  const { refetchData: fetchCreateLayout } = createLayout({
    name: layoutName,
    layout: initialLayoutWidgets,
    toolbox: initialToolboxWidgets,
  });

  const { refetchData: fetchDeleteLayout } = removeWidgetById(
    layoutIdToDelete ? layoutIdToDelete : ""
  );

  useEffect(() => {
    handleDeleteLayout<Widgets>(layoutIdToDelete, setLayoutIdToDelete, () => {
      fetchDeleteLayout().then(() => {
        refetchData();

        addNotification(
          "Deleted",
          "Stream events layout removed successfully",
          "danger"
        );
        setLayoutIdToDelete(null);
      });
    });
  }, [layoutIdToDelete]);

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  const { data: layouts } = data;

  const createNewLayout = () => {
    fetchCreateLayout().then(() => {
      refetchData();
      addNotification(
        "Success",
        "Stream events layout created successfully",
        "success"
      );
    });
  };

  return (
    <>
      <div className="events-layouts-header">Stream events layouts</div>
      <div className="events-layouts-list">
        <div className="events-layouts-btn">
          <input
            type="text"
            placeholder="Name"
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
          ></input>
          <button
            onClick={() => createNewLayout()}
            className="common-button primary-button"
          >
            Create
          </button>
        </div>
        {layouts.map((layout, index) => {
          return (
            <div key={index} className="widget-layouts-div">
              <button
                onClick={() => setLayoutIdToDelete(layout._id)}
                className="common-button danger-button remove-layout-btn"
              >
                X
              </button>
              <Link to={`${layout._id}`}>{layout.name}</Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
