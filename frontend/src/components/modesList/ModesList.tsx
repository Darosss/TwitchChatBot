import React from "react";
import PreviousPage from "@components/previousPage";
import { Link } from "react-router-dom";

export default function ModesList() {
  return (
    <>
      <PreviousPage />
      <div className="modes-menu-wrapper">
        <div>
          <Link to="moods">Moods</Link>
        </div>
        <div>
          <Link to="personalities">Personalities</Link>
        </div>
        <div>
          <Link to="tags">Tags</Link>
        </div>
      </div>
    </>
  );
}
