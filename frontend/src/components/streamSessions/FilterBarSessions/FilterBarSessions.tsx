import "./style.css";
import React from "react";
import UrlParamsInput from "@components/UrlParamsInputs";

export default function FilterBarSessions() {
  return (
    <div className="filter-users-wrapper">
      <UrlParamsInput>
        <input
          {...{ queryparam: "search_name" }}
          type="search"
          placeholder={"Title"}
        ></input>

        <input
          {...{ queryparam: "tags" }}
          type="search"
          placeholder={"Tags"}
        ></input>
        <input
          {...{ queryparam: "categories" }}
          type="search"
          placeholder={"Categories"}
        ></input>

        <input
          {...{ queryparam: "start_date" }}
          id="start-seen"
          type="date"
        ></input>
        <input {...{ queryparam: "end_date" }} type="date"></input>
      </UrlParamsInput>
    </div>
  );
}
