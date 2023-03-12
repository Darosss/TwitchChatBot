import "./style.css";
import React from "react";

import UrlParamsInput from "@components/urlParamsInputs";

export default function filterBarCategories() {
  return (
    <div className="filter-message-categories-wrapper">
      <UrlParamsInput>
        <input
          {...{ queryparam: "category" }}
          type="search"
          placeholder={"Category contains"}
        ></input>
        <input
          {...{ queryparam: "messages" }}
          type="search"
          placeholder={"Messages contains"}
        ></input>
      </UrlParamsInput>
    </div>
  );
}
