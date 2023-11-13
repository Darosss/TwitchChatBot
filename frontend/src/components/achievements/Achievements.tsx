import PreviousPage from "@components/previousPage";
import React from "react";
import { Link } from "react-router-dom";

export default function Achievements() {
  return (
    <>
      <PreviousPage />
      <div className="achievements-links-wrapper">
        <div>
          <Link to="list"> Achievements </Link>
        </div>
        <div>
          <Link to="badges"> Badges </Link>
        </div>
        <div>
          <Link to="badges/images"> Badges images</Link>
        </div>
        <div>
          <Link to="stages"> Stages </Link>
        </div>
        <div>
          <Link to="stages/sounds"> Stages sounds </Link>
        </div>
      </div>
    </>
  );
}
