import React from "react";

import { Link } from "react-router-dom";

export default function PreviousPage() {
  return (
    <div className="previous-page-wrapper">
      <Link className="common-button primary-button" to="../">
        &#8592;Back
      </Link>
    </div>
  );
}
