import "./style.css";
import React from "react";

import { Link } from "react-router-dom";

export default function PreviousPage() {
  return (
    <>
      <button className="common-button primary-button">
        <Link to="../">&#8592;Back</Link>
      </button>
    </>
  );
}
