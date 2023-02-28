import "./style.css";
import React from "react";

import { createPortal } from "react-dom";

export default function Modal(props: {
  title?: string;
  onClose: () => void;
  onSubmit: () => any;
  show?: boolean;
  children?: React.ReactNode;
}) {
  const { show = false, title = "Modal", onClose, onSubmit, children } = props;

  return createPortal(
    <div className={`modal ${show ? "show" : ""}`} onMouseDown={onClose}>
      <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="modal-title"> {title} </h4>
        </div>

        <div className="modal-body">{children}</div>

        <div className="modal-footer">
          <button onClick={onClose} className="modal-button modal-close-button">
            Close
          </button>
          <button
            onClick={onSubmit}
            className="modal-button modal-submit-button"
          >
            Submit
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("root")!
  );
}
