import "./style.css";
import React, { useState } from "react";
import DragableParent from "@components/DragableParent";
import Modal from "@components/Modal";

export default function WidgetWrapper(props: {
  id: string;
  children?: React.ReactNode;
}) {
  const { id, children } = props;

  const [showOptionsModal, setShowModal] = useState(false);

  return (
    <div id={id} className="widget-wrapper">
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
