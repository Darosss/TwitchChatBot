import "./style.css";
import React from "react";

export default function DragableParent() {
  const onDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.parentElement) {
      e.currentTarget.parentElement.style.position = "absolute";
      e.currentTarget.parentElement.style.left = `${
        e.pageX - e.currentTarget.offsetWidth / 2
      }px`;
      e.currentTarget.parentElement.style.top = `${e.pageY}px`;
    }
  };

  const dragStop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.parentElement) {
      e.currentTarget.parentElement.style.left = `${
        e.pageX - e.currentTarget.offsetWidth / 2
      }px`;
      e.currentTarget.parentElement.style.top = `${e.pageY}px`;
    }
  };

  return (
    <div
      className="window-draggable"
      onDrag={(e) => onDrag(e)}
      onDragEnd={(e) => dragStop(e)}
      onDragExit={(e) => dragStop(e)}
      draggable
    ></div>
  );
}
