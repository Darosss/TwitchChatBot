import "./style.css";
import React, { useState } from "react";

import DragableParent from "@components/dragableParent";
import Modal from "@components/modal";

export default function WidgetWrapper(props: {
  id: string;
  horizontal?: boolean;
  children?: React.ReactNode;
}) {
  const { id, horizontal, children } = props;

  const [showOptionsModal, setShowModal] = useState(false);

  return (
    <div
      id={id}
      className={`widget-wrapper ${horizontal ? "widget-wrapper-small" : ""}`}
    >
      {/* <div
        onClick={(e) => {
          setShowModal(true);
        }}
        className="widget-options"
      >
        &#9881;
      </div> */}
      <DragableParent />
      {children}
      {/* <Modal
        title={`Edit ${id}`}
        onClose={() => {
          setShowModal(false);
        }}
        onSubmit={() => {
          setShowModal(false);
        }}
        show={showOptionsModal}
      >
        <input type="range" min="100" max="1000"></input>
      </Modal> */}
    </div>
  );
}
