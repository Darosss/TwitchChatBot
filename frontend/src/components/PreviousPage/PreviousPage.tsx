import "./style.css";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Message() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <button onClick={goBack} className="prev-page-btn">
        &#8592;
      </button>
    </>
  );
}
