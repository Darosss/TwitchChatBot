import React from "react";

import { Link } from "react-router-dom";

export default function PreviousPage() {
  return (
    <>
      <Link className="common-button primary-button" to="../">
        &#8592;Back
      </Link>
    </>
  );
}
