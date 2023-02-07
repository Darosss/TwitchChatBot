import "./style.css";
import React from "react";
import DragableParent from "@components/DragableParent";

export default function WidgetWrapper(props: {
  id: string;
  children?: React.ReactNode;
}) {
  const { id, children } = props;

  return (
    <div id={id} className="widget-wrapper">
      <DragableParent />
      {children}
    </div>
  );
}
