import "./style.css";
import React from "react";

import { Link } from "react-router-dom";

export default function PreviousPage() {
  return (
    <>
      <button className="prev-page-btn">
        &#8592;
        <Link to="../">Back</Link>
      </button>
    </>
  );
}
