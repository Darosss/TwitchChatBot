import "./style.css";
import React from "react";

export default function HiddenMenu(props: { children?: React.ReactNode }) {
  const { children } = props;

  return (
    <nav className="btn-pluss-wrapper">
      {/* <h2 className="tooltip">Widgets!</h2> */}
      <div className="btn-pluss">
        <ul>{children}</ul>
      </div>
    </nav>
  );
}
