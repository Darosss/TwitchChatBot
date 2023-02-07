import "./style.css";
import React, { useEffect, useRef, useState } from "react";

export default function DragableParent() {
  const [positionOfWindow, setPositionOfWindow] = useState<{
    left: string;
    top: string;
  }>();

  const dragBar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPositionOfWindow(() => {
      if (dragBar?.current?.parentElement?.id) {
        const localPos = localStorage.getItem(
          dragBar?.current?.parentElement?.id
        );
        if (!localPos) return { left: "0px", top: "0px" };
        const localPosParsed = JSON.parse(localPos);

        return localPosParsed;
      }
    });
  }, []);

  useEffect(() => {
    const parentOfDragBar = dragBar?.current?.parentElement;
    if (parentOfDragBar && positionOfWindow) {
      parentOfDragBar.style.left = positionOfWindow.left;
      parentOfDragBar.style.top = positionOfWindow.top;
    }
  }, [positionOfWindow]);

  const onDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const parentElement = e.currentTarget.parentElement;
    if (parentElement) {
      parentElement.style.position = "absolute";
      parentElement.style.left = `${
        e.pageX - e.currentTarget.offsetWidth / 2
      }px`;
      parentElement.style.top = `${e.pageY}px`;
    }
  };

  const dragStop = (e: React.DragEvent<HTMLDivElement>) => {
    const parentElement = e.currentTarget.parentElement;
    if (parentElement) {
      parentElement.style.left = `${
        e.pageX - e.currentTarget.offsetWidth / 2
      }px`;
      parentElement.style.top = `${e.pageY}px`;

      if (parentElement.id) {
        localStorage.setItem(
          parentElement.id,
          JSON.stringify({
            left: parentElement.style.left,
            top: parentElement.style.top,
          })
        );
      }
    }
  };

  return (
    <div
      ref={dragBar}
      className="window-draggable"
      onDrag={(e) => onDrag(e)}
      onDragEnd={(e) => dragStop(e)}
      onDragExit={(e) => dragStop(e)}
      draggable
    ></div>
  );
}
