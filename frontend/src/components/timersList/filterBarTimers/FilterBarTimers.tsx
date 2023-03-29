import "./style.css";
import React from "react";
import UrlParamsInput from "@components/urlParamsInputs";

export default function FilterBarTimers() {
  return (
    <div className="filter-commands-wrapper">
      <UrlParamsInput>
        <input
          {...{ queryparam: "search_name" }}
          type="search"
          placeholder={"Timer name"}
        ></input>
        <input
          {...{ queryparam: "messages" }}
          type="search"
          placeholder={"Messages"}
        ></input>
      </UrlParamsInput>
    </div>
  );
}
