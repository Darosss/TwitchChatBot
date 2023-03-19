import "./style.css";
import React, { useState } from "react";
import { createLayout, getWidgets } from "@services/WidgetsService";
import { Link } from "react-router-dom";
import {
  initialLayoutWidgets,
  initialToolboxWidgets,
} from "src/layout/initialLayoutWidgets";

export default function StreamNotifications() {
  const { data, loading, error, refetchData } = getWidgets();

  const [layoutName, setLayoutName] = useState<string>("");

  const { refetchData: fetchCreateLayout } = createLayout({
    name: layoutName,
    layout: initialLayoutWidgets,
    toolbox: initialToolboxWidgets,
  });

  if (error) return <>There is an error. {error.response?.data.message}</>;
  if (!data || loading) return <>Loading!</>;

  const { data: layouts } = data;

  const createNewLayout = () => {
    fetchCreateLayout().then(() => refetchData());
  };

  return (
    <>
      <div className="events-layouts-header">Stream events layouts</div>
      <div className="events-layouts-list">
        <div className="events-layouts-btn">
          <input
            type="text"
            placeholder="Name"
            defaultValue={layoutName}
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
            <div key={index}>
              <Link to={`${layout._id}`}>{layout.name}</Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
